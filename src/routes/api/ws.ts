import type { ServerContext } from "@/server";
import type { SessionValidationResult } from "@/server/auth/session";
import { logger } from "@/utils/logger";
import { createFileRoute } from "@tanstack/react-router";
import { type Context, Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";

type HonoEnv = {
  Bindings: ServerContext & SessionValidationResult;
};

const wsLogger = logger.withTag("Websocket");

export const Route = createFileRoute("/api/ws")({
  server: {
    handlers: {
      ANY: ({ context, request }) => honoServer.fetch(request, context),
    },
  },
});

const honoServer = new Hono<HonoEnv>().get(
  "/api/ws",
  upgradeWebSocket((c: Context<HonoEnv>) => {
    return {
      onOpen(_event, _ws) {
        wsLogger.info("New websocket connection opened.");
      },
      async onMessage(event, ws) {
        wsLogger.log(
          `Websocket Message received from ${c.env.user?.username ?? "Unknown User"}`,
          event.data,
        );
        ws.send("Hello from Team 3132!");
      },
      onClose: () => {
        wsLogger.info("Websocket connection closed.");
      },
    };
  }),
);
