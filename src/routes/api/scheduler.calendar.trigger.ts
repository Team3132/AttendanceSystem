import { syncEvents } from "@/server/services/calalendarSync.service";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute(
  "/api/scheduler/calendar/trigger",
).methods({
  POST: async () => {
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
