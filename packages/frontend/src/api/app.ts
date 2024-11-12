import path from "node:path";
import { fileURLToPath } from "node:url";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { Settings } from "luxon";
import db, { migrate } from "./drizzle/db";
import { userTable } from "./drizzle/schema";
import env, { isProd } from "./env";
import mainLogger from "./logger";
import appRouter from "./routers/app.router";
import { createContext } from "./trpc/context";
import { generateState, OAuth2RequestError } from "arctic";
import { discord, lucia } from "./auth/lucia";
import { DiscordAPIError, REST } from "@discordjs/rest";
import { API } from "@discordjs/core";
import ee from "./utils/eventEmitter";

Settings.defaultLocale = "en-au";
Settings.defaultZone = "Australia/Sydney";

const root = path.dirname(fileURLToPath(import.meta.url));

await migrate();

const server = fastify({
  maxParamLength: 5000,
});

await server.register(fastifyCookie, { secret: env.SESSION_SECRET });

await server.register(fastifyTRPCPlugin, {
  prefix: "/api/trpc",
  useWSS: false,
  trpcOptions: { router: appRouter, createContext },
});

await server.register(await import("@fastify/websocket"));

// ws
await server.get("/api/ws", { websocket: true }, (socket) => {
  ee.on("invalidate", (data) => {
    socket.send(JSON.stringify(data));
  });
});

await server.get("/api/auth/discord", async (req, res) => {
  const state = generateState();
  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify", "guilds", "guilds.members.read"],
  });

  return res
    .setCookie("discord_oauth_state", state, {
      path: "/",
      secure: isProd,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    })
    .redirect(url.toString());
});

interface DiscordCallbackQuerystring {
  code: string;
  state: string;
}

await server.route<{ Querystring: DiscordCallbackQuerystring }>({
  method: "GET",
  url: "/api/auth/discord/callback",
  schema: {
    querystring: {
      type: "object",
      properties: {
        code: { type: "string" },
        state: { type: "string" },
      },
      required: ["code", "state"],
    },
  },
  handler: async (req, res) => {
    const { code, state } = req.query;

    const discordState = req.cookies.discord_oauth_state;

    if (discordState !== state) {
      res.redirect(env.VITE_FRONTEND_URL).send(); // TODO: Redirect to an error page
    }

    // Clear the state cookie
    res.clearCookie("discord_oauth_state");

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
        return res.redirect(env.VITE_FRONTEND_URL); // TODO: Redirect to an error page
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
        res.redirect(env.VITE_FRONTEND_URL).send(); // TODO: Redirect to an error page
      }

      const session = await lucia.createSession(discordUser.id, {});

      const sessionCookie = lucia.createSessionCookie(session.id);
      res
        .header("Set-Cookie", sessionCookie.serialize())
        .redirect(env.VITE_FRONTEND_URL)
        .send();
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

      res.redirect(env.VITE_FRONTEND_URL).send(); // TODO: Redirect to an error page
    }
  },
});

await server.register(fastifyStatic, {
  root: path.join(root, "frontend"),
  wildcard: true,
});

await server.setNotFoundHandler((_req, res) => {
  res.sendFile("index.html");
});

export default server;
