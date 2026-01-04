import { syncEvents } from "@/server/services/calalendarSync.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/scheduler/calendar/trigger")({
  server: {
    handlers: {
      POST: async () => {
        const result = await syncEvents();
        return Response.json(result);
      },
    },
  },
});
