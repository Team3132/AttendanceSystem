import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HonoEnv } from "../hono";
import { generateState, OAuth2RequestError } from "arctic";
import { discord, lucia } from "../auth/lucia";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import env, { isProd } from "../env";
import { DiscordAPIError, REST } from "@discordjs/rest";
import { API } from "@discordjs/core";
import { userTable } from "../drizzle/schema";
import db from "../drizzle/db";
import mainLogger from "../logger";

const discordRoutes = new OpenAPIHono<HonoEnv>()
  .openapi(
    createRoute({
      tags: ["Authentication"],
      method: "get",
      path: "",
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
      tags: ["Authentication"],
      method: "get",
      path: "callback",
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
  );

export { discordRoutes };
