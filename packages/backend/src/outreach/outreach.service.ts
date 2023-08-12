import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { event, rsvp, user } from '../drizzle/schema';
import { and, eq, gte, isNotNull, sql } from 'drizzle-orm';
import { LeaderboardDto } from './dto/LeaderboardDto';
import { DateTime } from 'luxon';

@Injectable()
export class OutreachService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {}

  /**
   * Gets the outreach leaderboard (paged)
   * @returns A list of student outreach leaders and their respective outreach points
   */
  public async getOutreachLeaderBoard() {
    /**
     * Get the last april 25, either this year or last year
     */
    const lastApril25 = getLastApril25().toISODate();

    /**
     * Get all rsvps that are checked in and checked out (query)
     */
    const rsvps = await this.db
      .select({
        outreachHours: sql<number>`round(sum(extract(epoch from (${rsvp.checkoutTime} - ${rsvp.checkinTime})) / 3600), 2)`,
        rank: sql<number>`rank() over (order by sum(extract(epoch from (${rsvp.checkoutTime} - ${rsvp.checkinTime})) / 3600) desc)`,
        username: user.username,
        userId: user.id,
      })
      .from(rsvp)
      .leftJoin(event, eq(rsvp.eventId, event.id))
      .where(
        and(
          and(isNotNull(rsvp.checkinTime), isNotNull(rsvp.checkoutTime)),
          and(
            gte(rsvp.checkoutTime, sql`${lastApril25}`),
            eq(event.type, 'Outreach'),
          ),
        ),
      )
      .having(sql`count(*) > 0`)
      .leftJoin(user, eq(rsvp.userId, user.id))
      .groupBy(user.id)
      .orderBy(
        sql`sum(extract(epoch from (${rsvp.checkoutTime} - ${rsvp.checkinTime})) / 3600) desc`,
      );

    return rsvps.map((singleData) => new LeaderboardDto(singleData));
  }
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
