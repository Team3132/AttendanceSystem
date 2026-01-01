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

const app = new Hono<HonoEnv>()
  .basePath("/api")
  .route("/auth/discord/callback", authDiscordCallback)
  .route("/auth/discord", authDiscord)
  .route("/scheduler/calendar/trigger", schedulerCalendarTriggerRoute)
  .route("/interaction", interactionRoute)
  .route("/ws", wsRoute);

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      ANY: ({ request, context }) => app.fetch(request, context),
    },
  },
});
