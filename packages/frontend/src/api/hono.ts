import { fromWebHandler } from "vinxi/http";
import { Context, Env, Hono, TypedResponse } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import ee from "./utils/eventEmitter";
import { stream, streamText, streamSSE } from "hono/streaming";
import { ulid } from "ulidx";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { generateState, OAuth2RequestError } from "arctic";
import { discord, lucia } from "./auth/lucia";
import { trimTrailingSlash } from "hono/trailing-slash";
import { trpcServer } from "@hono/trpc-server";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";
import env, { isProd } from "./env";
import { DiscordAPIError, REST } from "@discordjs/rest";
import { API } from "@discordjs/core";
import db from "./drizzle/db";
import { userTable } from "./drizzle/schema";
import mainLogger from "./logger";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import appRouter from "./routers/app.router";
import { createContext } from "./trpc/context";
import { apiReference } from "@scalar/hono-api-reference";
import { authRoutes } from "./routes/auth.routes";
import { Session, User } from "lucia";
import { authMiddleware } from "./middleware/auth.middleware";
import { contextStorage } from "hono/context-storage";

export interface HonoEnv extends Env {
  Variables: {
    user: User;
    session: Session;
  };
}

const app = new OpenAPIHono<HonoEnv>()
  .openapi(
    createRoute({
      method: "get",
      path: "/api/sse",
      responses: {
        200: {
          description: "Server Sent Events",
          content: {
            "text/event-stream": {
              schema: z.string(),
            },
          },
        },
      },
    }),
    async (c) => {
      return streamSSE(c, async (stream) => {
        ee.on("invalidate", (data) =>
          stream.writeSSE({
            data: JSON.stringify(data),
            event: "invalidate",
            id: ulid(),
          }),
        );
        // biome-ignore lint/complexity/noBannedTypes: <explanation>
      }) as unknown as TypedResponse<{}, 200, string>;
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/api/auth/discord",
      responses: {
        302: {
          headers: z.object({
            location: z.string(),
          }),
          description: "Redirect to Discord OAuth",
        },
      },
    }),
    async (c) => {
      const state = generateState();
      const url = await discord.createAuthorizationURL(state, {
        scopes: ["identify", "guilds", "guilds.members.read"],
      });

      setCookie(c, "discord_oauth_state", state, {
        path: "/",
        secure: isProd,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      });

      return c.redirect(url);
    },
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/api/auth/discord/callback",
      request: {
        query: z.object({
          code: z.string(),
          state: z.string(),
        }),
      },
      responses: {
        302: {
          headers: z.object({
            location: z.string(),
          }),
          description: "Redirect to Discord OAuth",
        },
      },
    }),
    async (c) => {
      const { code, state } = c.req.valid("query");

      const discordState = getCookie(c, "discord_oauth_state");

      if (discordState !== state) {
        return c.redirect(env.VITE_FRONTEND_URL);
      }

      deleteCookie(c, "discord_oauth_state");

      try {
        const tokens = await discord.validateAuthorizationCode(code);

        const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(
          tokens.accessToken,
        );
        const api = new API(rest);

        const discordUserGuilds = await api.users.getGuilds();

        const validGuild =
          discordUserGuilds.findIndex(
            (guild) => guild.id === env.VITE_GUILD_ID,
          ) !== -1;

        if (!validGuild) {
          return c.redirect(env.VITE_FRONTEND_URL);
        }

        const discordUser = await api.users.get("@me");

        const guildMember = await api.users.getGuildMember(env.VITE_GUILD_ID);

        const [authedUser] = await db
          .insert(userTable)
          .values({
            id: discordUser.id,
            username: guildMember.nick || discordUser.username,
            roles: guildMember.roles,
          })
          .onConflictDoUpdate({
            target: userTable.id,
            set: {
              username: guildMember.nick || discordUser.username,
              roles: guildMember.roles,
              updatedAt: new Date().toISOString(),
            },
          })
          .returning();

        if (!authedUser) {
          return c.redirect(env.VITE_FRONTEND_URL); // TODO: Redirect to an error page
        }

        const session = await lucia.createSession(discordUser.id, {});

        const sessionCookie = lucia.createSessionCookie(session.id);
        setCookie(
          c,
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );

        return c.redirect(env.VITE_FRONTEND_URL);
      } catch (error) {
        if (error instanceof OAuth2RequestError) {
          mainLogger.error(error);
        } else if (error instanceof DiscordAPIError) {
          mainLogger.error(error);
        } else if (error instanceof Error) {
          mainLogger.error(error);
        } else {
          mainLogger.error("Unknown error", error);
        }

        return c.redirect(env.VITE_FRONTEND_URL); // TODO: Redirect to an error page
      }
    },
  )
  .doc31("/api/docs/openapi.json", {
    openapi: "3.1.0",
    info: { title: "foo", version: "1" },
    security: [
      {
        type: ["http"],
        scheme: ["bearer"],
      },
    ],
  })
  .use(trimTrailingSlash())
  .use(contextStorage())
  .use(authMiddleware())
  .use(
    "/api/trpc/*",
    trpcServer({
      endpoint: "/api/trpc",
      router: appRouter,
      createContext,
    }),
  ) // new endpoint
  .get(
    "/api/docs",
    apiReference({
      spec: {
        url: "/api/docs/openapi.json",
      },
    }),
  )
  .route("/api/auth", authRoutes);

export type AppType = typeof app;

export default fromWebHandler(async (req) => app.fetch(req));
