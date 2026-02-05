import type { ServerContext } from "@/server";
import type { SessionValidationResult } from "@/server/auth/session";
import { logger } from "@/utils/logger";
import { createFileRoute } from "@tanstack/react-router";
import { unpack } from "msgpackr";

const wsLogger = logger.withTag("Websocket");

export const Route = createFileRoute("/api/ws")({
  server: {
    handlers: {
      GET: ({ context, request }) => {
        const success = (
          context as unknown as ServerContext & SessionValidationResult
        ).server?.upgrade(request, {
          data: {
            message: (ws, message) => {
              wsLogger.log("Message received from websocket", message);
              const unpacked =
                typeof message !== "string" ? unpack(message) : undefined;
              if (unpacked) {
                wsLogger.log("Unpacked", unpacked);
              }
              ws.send("Hello from 3132!");
            },
            open: (_ws) => {
              wsLogger.log("Websocket connection opened!");
            },
            close: (_ws, _code, _reason) => {
              wsLogger.log("Websocket connection closed!");
            },
          },
        });
        if (!success) throw new Error("Failed to open websocket");

        return undefined;
      },
    },
  },
});
