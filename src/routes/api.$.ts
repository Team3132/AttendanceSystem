import { createFileRoute } from "@tanstack/react-router";
import { Hono } from "hono";
import { authDiscord } from "./-api/auth.discord";
import { authDiscordCallback } from "./-api/auth.discord.callback";
import { interactionRoute } from "./-api/interaction";
import { schedulerCalendarTriggerRoute } from "./-api/scheduler.calendar.trigger";
import { schedulerReminderTriggerRoute } from "./-api/scheduler.reminder.trigger";
import { sseRoute } from "./-api/sse";

const app = new Hono().basePath("/api");
app.route("/auth/discord/callback", authDiscordCallback);
app.route("/auth/discord", authDiscord);
app.route("/scheduler/reminder/trigger", schedulerReminderTriggerRoute);
app.route("/scheduler/calender/trigger", schedulerCalendarTriggerRoute);
app.route("/interaction", interactionRoute);
app.route("/sse", sseRoute);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => app.fetch(request),
    },
  },
});
