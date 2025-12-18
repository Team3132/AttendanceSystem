import { createFileRoute } from "@tanstack/react-router";
import { Hono } from "hono";
import { authDiscord } from "./-api/auth.discord";
import { authDiscordCallback } from "./-api/auth.discord.callback";
import { interactionRoute } from "./-api/interaction";
import { schedulerCalendarTriggerRoute } from "./-api/scheduler.calendar.trigger";
import { schedulerReminderTriggerRoute } from "./-api/scheduler.reminder.trigger";
import { wsRoute } from "./-api/ws";

const app = new Hono().basePath("/api");
app.route("/auth/discord/callback", authDiscordCallback);
app.route("/auth/discord", authDiscord);
app.route("/scheduler/reminder/trigger", schedulerReminderTriggerRoute);
app.route("/scheduler/calendar/trigger", schedulerCalendarTriggerRoute);
app.route("/interaction", interactionRoute);
app.route("/ws", wsRoute);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      ANY: async ({ request, context: { server } }) =>
        app.fetch(request, server),
    },
  },
});
