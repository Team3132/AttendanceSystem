import {
  and,
  arrayOverlaps,
  count,
  eq,
  gte,
  isNotNull,
  not,
  sql,
} from "drizzle-orm";
import db from "../drizzle/db";
import { event, rsvp, user } from "../drizzle/schema";
import { DateTime } from "luxon";
import env from "../env";
import { z } from "zod";
import { OutreachTimeSchema } from "../schema/OutreachTimeSchema";
import { PagedLeaderboardSchema } from "../schema/PagedLeaderboardSchema";

/**
 * Get the sum of the difference between the start and end dates of all
 * events that have been attended by a user and that are outreach events as an iso duration
 *
 * Filters out events that have not been attended, and events that are not outreach events
 * and every event before the last 25th of the last april, all in sql
 */
export async function getOutreachTime(
  params: z.infer<typeof OutreachTimeSchema>
): Promise<z.infer<typeof PagedLeaderboardSchema>> {
  const { limit, cursor: page } = OutreachTimeSchema.parse(params);
  const lastApril25 = getLastApril25();

  if (!lastApril25) {
    throw new Error("Could not find a valid date for last April 25th");
  }

  const aprilIsoDate = lastApril25.toISODate();

  if (!aprilIsoDate) {
    throw new Error("Could not convert last April 25th to ISO date");
  }

  const offset = page * limit;
  const { items, total } = await db.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL intervalstyle = 'iso_8601'`); // set the interval style to iso_8601

    const items = await tx
      .select({
        /** Username */
        username: user.username,
        /** UserId */
        userId: user.id,
        /** Duration (in ISO8601 format) */
        duration: sql<string>`sum(${rsvp.checkoutTime} - ${rsvp.checkinTime})`,
      })
      .from(rsvp)
      .groupBy(user.id)
      .leftJoin(event, eq(rsvp.eventId, event.id))
      .innerJoin(user, eq(rsvp.userId, user.id))
      .orderBy(
        sql<string>`sum(${rsvp.checkoutTime} - ${rsvp.checkinTime}) DESC`
      )
      .where(
        and(
          eq(event.type, "Outreach"),
          not(arrayOverlaps(user.roles, [env.MENTOR_ROLE_ID])),
          isNotNull(rsvp.checkinTime),
          isNotNull(rsvp.checkoutTime),
          gte(event.startDate, aprilIsoDate)
        )
      )
      .limit(limit)
      .offset(offset);

    let total = 0;

    const [firstData] = await tx
      .select({ total: count() })
      .from(user)
      .leftJoin(rsvp, eq(user.id, rsvp.userId))
      .leftJoin(event, eq(rsvp.eventId, event.id))
      .where(
        and(
          eq(event.type, "Outreach"),
          not(arrayOverlaps(user.roles, [env.MENTOR_ROLE_ID])),
          isNotNull(rsvp.checkinTime),
          isNotNull(rsvp.checkoutTime),
          gte(event.startDate, aprilIsoDate)
        )
      );

    if (firstData) {
      total = firstData.total;
    }

    return {
      items,
      total,
    };
  });

  // add rank to the result
  const result = items.map((row, index) => ({
    ...row,
    rank: index + 1 + offset,
  }));

  // If no next page then undefined
  const nextPage = total > offset + limit ? page + 1 : undefined;

  return {
    items: result,
    page,
    total,
    nextPage,
  };
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
