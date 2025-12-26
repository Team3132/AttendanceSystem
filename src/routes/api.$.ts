import { createFileRoute } from "@tanstack/react-router";
import type { Register } from "@tanstack/react-start";
import { type Env, Hono } from "hono";
import { authDiscord } from "./-api/auth.discord";
import { authDiscordCallback } from "./-api/auth.discord.callback";
import { interactionRoute } from "./-api/interaction";
import { schedulerCalendarTriggerRoute } from "./-api/scheduler.calendar.trigger";
import { wsRoute } from "./-api/ws";

export interface HonoEnv extends Env {
  Variables: Register["server"]["requestContext"];
}

const app = new Hono<HonoEnv>().basePath("/api");
app.route("/auth/discord/callback", authDiscordCallback);
app.route("/auth/discord", authDiscord);
app.route("/scheduler/calendar/trigger", schedulerCalendarTriggerRoute);
app.route("/interaction", interactionRoute);
app.route("/ws", wsRoute);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      ANY: async ({ request, context }) => app.fetch(request, context),
    },
  },
});
