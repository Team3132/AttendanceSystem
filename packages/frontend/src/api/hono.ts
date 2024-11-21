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
import { contextStorage } from "hono/context-storage";
import { auth, authResponses } from "./middleware/auth.middleware";

export interface HonoEnv extends Env {
  Variables:
    | {
        user: User;
        session: Session;
      }
    | {
        user: null;
        session: null;
      };
}

const app = new OpenAPIHono<HonoEnv>()
  .openapi(
    createRoute({
      method: "get",
      path: "/api/sse",
      middleware: auth(),
      responses: {
        200: {
          description: "Server Sent Events",
          content: {
            "text/event-stream": {
              schema: z.any(),
            },
          },
        },
        401: authResponses[401],
      },
    }),
    async (c) => {
      const sseRes = streamSSE(c, async (stream) => {
        ee.on("invalidate", (data) =>
          stream.writeSSE({
            data: JSON.stringify(data),
            event: "invalidate",
            id: ulid(),
          }),
        );

        stream.onAbort(() => {
          ee.off("invalidate");
        });
        // biome-ignore lint/complexity/noBannedTypes: <explanation>
      }) as unknown as TypedResponse<{}, 200, string>;

      return sseRes;
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
