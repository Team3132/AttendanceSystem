import { syncEvents } from "@/server/services/calalendarSync.service";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/scheduler/calendar/trigger")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const result = await syncEvents();

          return json(result);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";

          return json({ error: errorMessage }, { status: 500 });
        }
      },
    },
  },
});
