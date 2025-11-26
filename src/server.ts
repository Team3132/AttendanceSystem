import { type Register, createServerOnlyFn } from "@tanstack/react-start";
import type { RequestOptions } from "@tanstack/react-start/server";
import handler from "@tanstack/react-start/server-entry";
import type { Server } from "bun";
import { type BunWebSocketData, websocket } from "hono/bun";
import { migrate } from "./server/drizzle/db";

type MyRequestContext = {
  server: Server<BunWebSocketData>;
};

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: MyRequestContext;
    };
  }
}

await migrate();

export default {
  fetch(
    req: Request,
    opts: RequestOptions<Register>,
  ): Response | Promise<Response> {
    return createServerOnlyFn(handler.fetch)(req, opts);
  },
  websocket,
};
