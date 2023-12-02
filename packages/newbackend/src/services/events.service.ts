import { DateTime } from "luxon";
import db from "../drizzle/db";
import { between } from "drizzle-orm";
import { rsvp } from "../drizzle/schema";

/**
 * Get upcoming events in the next 24 hours for the daily bot announcement
 */
export async function getNextEvents() {
  const startNextDay = DateTime.now().plus({ day: 1 }).startOf("day");

  const endNextDay = startNextDay.endOf("day");

  const nextEvents = await db.query.event.findMany({
    where: (event) =>
      between(event.startDate, startNextDay.toISO(), endNextDay.toISO()),
    with: {
      rsvps: {
        orderBy: [rsvp.status, rsvp.updatedAt],
        with: {
          user: {
            columns: {
              username: true,
              roles: true,
            },
          },
        },
      },
    },
  });

  return nextEvents;
}