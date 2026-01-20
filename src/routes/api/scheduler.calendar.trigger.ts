import type { ServerContext } from "@/server";
import { syncEvents } from "@/server/services/calalendarSync.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/scheduler/calendar/trigger")({
  server: {
    handlers: {
      POST: async ({ context }) => {
        const result = await syncEvents(context as unknown as ServerContext);
        return Response.json(result);
      },
    },
  },
});
