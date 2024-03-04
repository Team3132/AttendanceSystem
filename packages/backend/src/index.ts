import path from "path";
import { fileURLToPath } from "url";
import fastifyCookie from "@fastify/cookie";
import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import fastifyStatic from "@fastify/static";
import ws from "@fastify/websocket";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { TRPCReconnectNotification } from "@trpc/server/rpc";
import { eq } from "drizzle-orm";
import fastify from "fastify";
import { Settings } from "luxon";
import { WebSocket } from "ws";
import discordStrategy from "./auth/Discord.strategy";
import db, { migrate } from "./drizzle/db";
import { user } from "./drizzle/schema";
import env, { isProd } from "./env";
import mainLogger from "./logger";
import { registerCron } from "./registerCron";
import appRouter, { AppRouter } from "./routers/app.router";
import { createContext } from "./trpc/context";
import jwt from "@fastify/jwt";

Settings.defaultLocale = "en-au";
Settings.defaultZone = "Australia/Sydney";

const root = path.dirname(fileURLToPath(import.meta.url));

await migrate();

const server = fastify({
  maxParamLength: 5000,
});

await server.register(fastifyCookie);

await server.register(fastifySecureSession, {
  cookieName: "session",
  key: Buffer.from(env.SESSION_SECRET, "hex"),
  cookie: {
    path: "/",
    sameSite: "strict",
    secure: isProd,
    httpOnly: true,
  },
});

await server.register(jwt, {
  secret: env.JWT_SECRET,
})

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

await server.register(fastifyPassport.initialize());
await server.register(fastifyPassport.secureSession());
await fastifyPassport.use("discord", discordStrategy);

type User = typeof user.$inferSelect;

declare module "fastify" {
  interface PassportUser extends User { }
}

// register a serializer that stores the user object's id in the session ...
fastifyPassport.registerUserSerializer(async (user: User) => user.id);

// ... and then a deserializer that will fetch that user from the database when a request with an id in the session arrives
fastifyPassport.registerUserDeserializer(async (id: string) => {
  const [dbUser] = await db.select().from(user).where(eq(user.id, id)).limit(1);

  if (!dbUser) {
    return null;
  }

  return dbUser;
});

await server.register(fastifyTRPCPlugin, {
  prefix: "/api/trpc",
  useWSS: true,
  trpcOptions: { router: appRouter, createContext },
});

await server.get("/api/auth/discord", {
  preValidation: fastifyPassport.authenticate("discord", { authInfo: false }),
  handler: async (_req, res) => {
    return res.redirect(env.FRONTEND_URL);
  },
});

await server.get("/api/auth/discord/callback", {
  preValidation: fastifyPassport.authenticate("discord", {
    authInfo: false,
    failureRedirect: "/login",
    successRedirect: env.FRONTEND_URL,
  }),
  handler: async (_req, res) => {
    return res.redirect(env.FRONTEND_URL);
  },
});

await server.get("/api/auth/discord-desktop", {
  preValidation: fastifyPassport.authenticate("discord", { authInfo: false }),
  handler: async (_req, res) => {
    return res.redirect(env.FRONTEND_URL);
  },
})

await server.get("/api/auth/discord-desktop/callback", {
  preValidation: fastifyPassport.authenticate("discord", {
    authInfo: false,
    failureRedirect: "/login",
    successRedirect: env.FRONTEND_URL,
  }),
  handler: async (req, res) => {
    if (!req.user) {
      return res.redirect("/api/auth/discord-desktop")
    }

    const jwtPayload = {
      id: req.user.id
    }

    // This callback should redirect to a deep link that will open the desktop app with an access token
    // and refresh token in the URL.
    const accessToken = await res.jwtSign(jwtPayload, {
      sign: {
        expiresIn: "1h",
      }
    })

    const refreshToken = await res.jwtSign(jwtPayload, {
      sign: {
        expiresIn: "7d",
      }
    })

    return res.redirect(`tdu://auth?accessToken=${accessToken}&refreshToken=${refreshToken}`)
  },
});

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

export { type AppRouter };
export * as Schema from "./schema";
