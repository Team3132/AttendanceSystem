import { and, arrayOverlaps, eq, gte, isNotNull, not, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { event, rsvp, user } from "../drizzle/schema";
import { DateTime } from "luxon";
import env from "../env";

/**
 * Get the sum of the difference between the start and end dates of all
 * events that have been attended by a user and that are outreach events as an iso duration
 *
 * Filters out events that have not been attended, and events that are not outreach events
 * and every event before the last 25th of the last april, all in sql
 */
export function getOutreachTime() {
  const lastApril25 = getLastApril25();

  if (!lastApril25) {
    throw new Error("Could not find a valid date for last April 25th");
  }

  const aprilIsoDate = lastApril25.toISODate();

  if (!aprilIsoDate) {
    throw new Error("Could not convert last April 25th to ISO date");
  }

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
        /** Rank */
        rank: sql<string>`rank() over (order by sum(${rsvp.checkoutTime} - ${rsvp.checkinTime}) desc)`,
      })
      .from(rsvp)
      .groupBy(user.id)
      .leftJoin(event, eq(rsvp.eventId, event.id))
      .innerJoin(user, eq(rsvp.userId, user.id))
      .where(
        and(
          eq(event.type, "Outreach"),
          not(arrayOverlaps(user.roles, [env.MENTOR_ROLE_ID])),
          isNotNull(rsvp.checkinTime),
          isNotNull(rsvp.checkoutTime),
          gte(event.startDate, aprilIsoDate)
        )
      );
  });
}

function getLastApril25() {
  const today = DateTime.local();
  const thisYear = today.year;
  const lastYear = thisYear - 1;

  // Loop from the current year to the previous year
  for (let year = thisYear; year >= lastYear; year--) {
    // Create a DateTime object for April 25th of the current year in the loop
    const dateToCheck = DateTime.fromObject({ year, month: 4, day: 25 });

    // If the date is in the future, skip to the next year
    if (dateToCheck > today) {
      continue;
    }

    return dateToCheck;
  }

  return null; // Return null if no valid date is found in the given range
}
