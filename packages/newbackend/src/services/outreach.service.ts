import {
  SQL,
  and,
  arrayContains,
  arrayOverlaps,
  eq,
  isNotNull,
  not,
  sql,
} from "drizzle-orm";
import db from "../drizzle/db";
import { event, rsvp, user } from "../drizzle/schema";
import { Duration } from "luxon";

/**
 * Get the sum of the difference between the start and end dates of all
 * events that have been attended by a user and that are outreach events as an iso duration
 */
export function getOutreachTime() {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL intervalstyle = 'iso_8601'`); // set the interval style to iso_8601

    return tx
      .select({
        /** Username */
        username: user.username,
        /** UserId */
        userId: user.id,
        /** Duration (in ISO8601 format) */
        duration: sql<string>`sum(${rsvp.checkoutTime} - ${rsvp.checkinTime})`,
        rank: sql<number>`rank() over (order by sum(${rsvp.checkoutTime} - ${rsvp.checkinTime}) desc)`,
      })
      .from(rsvp)
      .groupBy(user.id)
      .leftJoin(event, eq(rsvp.eventId, event.id))
      .innerJoin(user, eq(rsvp.userId, user.id))
      .where(
        and(
          eq(event.type, "Outreach"),
          // not(arrayOverlaps(user.roles, ["mentorId"]))
          isNotNull(rsvp.checkinTime),
          isNotNull(rsvp.checkoutTime)
        )
      );
  })
}
