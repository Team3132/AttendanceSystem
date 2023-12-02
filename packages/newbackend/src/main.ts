import fastify from "fastify";
import { migrate } from "./drizzle/db";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
import fastifyStatic from "@fastify/static";
import env, { isProd } from "./env";
import path from "path";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { fileURLToPath } from "url";
import appRouter, { AppRouter } from "./routers/app.router";
import { createContext } from "./trpc/context";

const root = path.dirname(fileURLToPath(import.meta.url));

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

await migrate();

await server.register(fastifyStatic, {
  root: path.join(root, "public"),
  wildcard: false,
});

await server.register(fastifyTRPCPlugin, {
  prefix: "/api/trpc",
  trpcOptions: { router: appRouter, createContext },
});

await server.listen({ port: env.PORT, host: "0.0.0.0" }).catch((err) => {
  console.error(err);
  process.exit(1);
});

export { type AppRouter }
