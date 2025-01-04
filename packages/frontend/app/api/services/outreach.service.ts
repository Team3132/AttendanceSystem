"use server";

import {
  and,
  arrayOverlaps,
  count,
  desc,
  eq,
  gte,
  isNotNull,
  not,
  sql,
  sum,
} from "drizzle-orm";
import { DateTime } from "luxon";
import type { z } from "zod";
import db from "../drizzle/db";
import { eventTable, rsvpTable, userTable } from "../drizzle/schema";
import env from "../env";
import { OutreachTimeSchema } from "../schema/OutreachTimeSchema";
import type { PagedLeaderboardSchema } from "../schema/PagedLeaderboardSchema";

/**
 * Get the sum of the difference between the start and end dates of all
 * events that have been attended by a user and that are outreach events as an iso duration
 *
 * Filters out events that have not been attended, and events that are not outreach events
 * and every event before the last 25th of the last april, all in sql
 */
export async function getOutreachTime(
  params: z.infer<typeof OutreachTimeSchema>,
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

    const baseQuery = tx
      .select({
        /** Username */
        username: userTable.username,
        /** UserId */
        userId: userTable.id,
        /** Duration (in ISO8601 format) */
        duration:
          sql<string>`sum(${rsvpTable.checkoutTime} - ${rsvpTable.checkinTime})`.as(
            "duration",
          ),
      })
      .from(rsvpTable)
      .innerJoin(eventTable, eq(rsvpTable.eventId, eventTable.id))
      .innerJoin(userTable, eq(rsvpTable.userId, userTable.id))
      .groupBy(userTable.id)
      .where(
        and(
          eq(eventTable.type, "Outreach"),
          not(arrayOverlaps(userTable.roles, [env.VITE_MENTOR_ROLE_ID])),
          isNotNull(rsvpTable.checkinTime),
          isNotNull(rsvpTable.checkoutTime),
          eq(rsvpTable.status, "ATTENDED"),
          gte(eventTable.startDate, aprilIsoDate),
        ),
      )
      .as("baseQuery");

    const [leaderboardCount] = await tx
      .select({
        count: count(),
      })
      .from(baseQuery);

    const offset = page * limit;

    const items = await tx
      .select({
        username: baseQuery.username,
        userId: baseQuery.userId,
        duration: baseQuery.duration,
      })
      .from(baseQuery)
      .orderBy(desc(baseQuery.duration), baseQuery.username)
      .offset(offset)
      .limit(limit);

    let total = 0;

    if (leaderboardCount) {
      total = leaderboardCount.count;
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
