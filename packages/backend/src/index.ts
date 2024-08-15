import path from "node:path";
import { fileURLToPath } from "node:url";
import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import ws from "@fastify/websocket";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import type { TRPCReconnectNotification } from "@trpc/server/rpc";
import fastify from "fastify";
import { Settings } from "luxon";
import type { WebSocket } from "ws";
import db, { migrate } from "./drizzle/db";
import { userTable } from "./drizzle/schema";
import env, { isProd } from "./env";
import mainLogger from "./logger";
import { registerCron } from "./registerCron";
import appRouter, { type AppRouter } from "./routers/app.router";
import { createContext } from "./trpc/context";
import { generateState, OAuth2RequestError } from "arctic";
import { discord, lucia } from "./auth/lucia";
import { DiscordAPIError, REST } from "@discordjs/rest";
import { API } from "@discordjs/core";
import { csrfPlugin } from "./auth/csrf";

Settings.defaultLocale = "en-au";
Settings.defaultZone = "Australia/Sydney";

const root = path.dirname(fileURLToPath(import.meta.url));

await migrate();

const server = fastify({
  maxParamLength: 5000,
});

await server.register(fastifyCookie, { secret: env.SESSION_SECRET });

await server.register(ws, {
  preClose: async (done) => {
    const { websocketServer } = server;
    const response: TRPCReconnectNotification = {
      id: null,
      method: "reconnect",
    };
    const data = JSON.stringify(response);
    for (const client of websocketServer.clients) {
      if (client.readyState === 1 /* ws.OPEN */) {
        client.send(data);
      }
      client.close();
    }
    server.close(done);
  },
});

server.websocketServer.on("connection", (socket: WebSocket) => {
  console.log(`➕➕ Connection (${server.websocketServer.clients.size})`);
  socket.once("close", () => {
    console.log(`➖➖ Connection (${server.websocketServer.clients.size})`);
  });
});

await server.register(csrfPlugin, {
  enabled: false,
});

await server.register(fastifyTRPCPlugin, {
  prefix: "/api/trpc",
  useWSS: true,
  trpcOptions: { router: appRouter, createContext },
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
      res.redirect(env.FRONTEND_URL).send(); // TODO: Redirect to an error page
    }

    // Clear the state cookie
    res.clearCookie("discord_oauth_state");

    try {
      const tokens = await discord.validateAuthorizationCode(code);
      console.log(tokens);
      const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(
        tokens.accessToken,
      );
      const api = new API(rest);

      const discordUserGuilds = await api.users.getGuilds();

      const validGuild =
        discordUserGuilds.findIndex((guild) => guild.id === env.GUILD_ID) !==
        -1;

      if (!validGuild) {
        return res.redirect(env.FRONTEND_URL); // TODO: Redirect to an error page
      }

      const discordUser = await api.users.get("@me");

      const guildMember = await api.users.getGuildMember(env.GUILD_ID);

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
        res.redirect(env.FRONTEND_URL).send(); // TODO: Redirect to an error page
      }

      const session = await lucia.createSession(discordUser.id, {});

      const sessionCookie = lucia.createSessionCookie(session.id);
      res
        .header("Set-Cookie", sessionCookie.serialize())
        .redirect(env.FRONTEND_URL)
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

      res.redirect(env.FRONTEND_URL).send(); // TODO: Redirect to an error page
    }
  },
});

// await server.get("/api/auth/discord-desktop/callback", {
//   preValidation: fastifyPassport.authenticate("discord", {
//     authInfo: false,
//     failureRedirect: "/login",
//     successRedirect: env.FRONTEND_URL,
//   }),
//   handler: async (req, res) => {
//     if (!req.user) {
//       return res.redirect("/api/auth/discord-desktop")
//     }

//     const jwtPayload = {
//       id: req.user.id
//     }

//     // This callback should redirect to a deep link that will open the desktop app with an access token
//     // and refresh token in the URL.
//     const accessToken = await res.jwtSign(jwtPayload, {
//       sign: {
//         expiresIn: "1h",
//       }
//     })

//     const refreshToken = await res.jwtSign(jwtPayload, {
//       sign: {
//         expiresIn: "7d",
//       }
//     })

//     return res.redirect(`tdu://auth?accessToken=${accessToken}&refreshToken=${refreshToken}`)
//   },
// });

console.log(path.join(root, "frontend"));

await server.register(fastifyStatic, {
  root: path.join(root, "frontend"),
  wildcard: true,
});

await server.setNotFoundHandler((_req, res) => {
  res.sendFile("index.html");
});

server.listen(
  {
    port: env.PORT,
    host: "0.0.0.0",
    listenTextResolver: (addr) => `Server is listening at ${addr}`,
  },
  (err, address) => {
    if (err) {
      mainLogger.error(err);
      process.exit(1);
    }

    mainLogger.info(address);
  },
);

registerCron();

export type { AppRouter };
export * as Schema from "./schema";
