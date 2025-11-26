import { syncEvents } from "@/server/services/calalendarSync.service";
import { Hono } from "hono";

export const schedulerCalendarTriggerRoute = new Hono().post("/", async (c) => {
  const result = await syncEvents();

  return c.json(result);
});
