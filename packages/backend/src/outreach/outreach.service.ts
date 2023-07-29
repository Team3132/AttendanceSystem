import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { event, rsvp, user } from '../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class OutreachService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {}

  /**
   * Gets the outreach leaderboard (paged)
   * @returns A list of student outreach leaders and their respective outreach points
   */
  public async getOutreachLeaderBoard() {
    const rsvps = await this.db
      .select({
        outreachHours: sql<number>`SUM(DATEDIFF("hour", ${event.startDate}, ${event.endDate}))`,
      })
      .from(rsvp)
      .leftJoin(event, eq(rsvp.eventId, event.id))
      .where(eq(event.type, 'Outreach'))
      .leftJoin(user, eq(rsvp.userId, user.id))
      .groupBy(user.id);

    return rsvps;
  }
}
