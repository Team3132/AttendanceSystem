import { createPubSub } from "@graphql-yoga/subscription";
import { type Register, createServerOnlyFn } from "@tanstack/react-start";
import type { RequestOptions } from "@tanstack/react-start/server";
import handler from "@tanstack/react-start/server-entry";
import type { Server } from "bun";
import { type BunWebSocketData, websocket } from "hono/bun";
import type z from "zod";
import { migrate } from "./server/drizzle/db";
import type { RSVPStatusSchema } from "./server/schema";

const pubSub = createPubSub<{
  "event:rsvpUpdated": [
    eventId: string,
    payload: {
      userId: string;
      rsvpId: string;
      status?: z.infer<typeof RSVPStatusSchema> | null;
    },
  ];
}>();

type MyRequestContext = {
  server: Server<BunWebSocketData>;
  pubSub: typeof pubSub;
};

// This needs to be tanstack router, currently incorrect
declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: MyRequestContext;
    };
  }
}

// Remove this later
declare module "@tanstack/react-router" {
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
    const context = { ...opts.context, pubSub };

    return createServerOnlyFn(handler.fetch)(req, { context });
  },
  websocket,
};
