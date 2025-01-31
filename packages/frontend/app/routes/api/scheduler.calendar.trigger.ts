import { syncEvents } from "@/server/services/calalendarSync.service";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

export const APIRoute = createAPIFileRoute("/api/scheduler/calendar/trigger")({
  GET: async () => {
    try {
      const result = await syncEvents();

      return json(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      return json({ error: errorMessage }, { status: 500 });
    }
  },
});
