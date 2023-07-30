import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { event, rsvp, user } from '../../drizzle/schema';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { LeaderboardDto } from './dto/LeaderboardDto';

@Injectable()
export class OutreachService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {}

  /**
   * Gets the outreach leaderboard (paged)
   * @returns A list of student outreach leaders and their respective outreach points
   */
  public async getOutreachLeaderBoard() {
    const lastApril25OfThisYear = `'${new Date().getFullYear()}-04-25'`;

    const rsvps = await this.db
      .select({
        outreachHours: sql<number>`SUM(ROUND(EXTRACT(EPOCH FROM (${event.endDate} - ${event.startDate}) ) / 3600, 2)) as outreachHours`,
        userId: user.id,
        username: user.username,
        rank: sql<number>`RANK() OVER (ORDER BY SUM(ROUND(EXTRACT(EPOCH FROM (${event.endDate} - ${event.startDate}) ) / 3600, 2)) DESC)`,
      })
      .from(rsvp)
      .leftJoin(event, eq(rsvp.eventId, event.id))
      .where(
        and(
          and(eq(event.type, 'Outreach'), eq(rsvp.status, 'YES')),
          gte(event.endDate, lastApril25OfThisYear),
        ),
      )
      .leftJoin(user, eq(rsvp.userId, user.id))
      .groupBy(user.id)
      .orderBy(desc(sql`outreachHours`))
      .having(
        sql`SUM(ROUND(EXTRACT(EPOCH FROM (${event.endDate} - ${event.startDate}) ) / 3600, 2)) > 0`,
      );

    return rsvps.map((singleData) => new LeaderboardDto(singleData));
  }
}
