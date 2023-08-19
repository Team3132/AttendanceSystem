import { BotService } from '../bot/bot.service';
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { event, rsvp, user } from '../drizzle/schema';
import { and, eq, isNotNull, isNull } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly botService: BotService,
  ) {}

  deleteUser(userId: string) {
    return this.db.delete(user).where(eq(user.id, userId)).returning();
  }

  async discordProfile(userId: string) {
    return this.botService.getGuildMember(userId);
  }

  async activeRsvps(userId: string) {
    const pendingRsvps = await this.db
      .select()
      .from(rsvp)
      .where(
        and(
          and(eq(rsvp.userId, userId), isNull(rsvp.checkoutTime)),
          isNotNull(rsvp.checkinTime),
        ),
      )
      .leftJoin(event, eq(rsvp.eventId, event.id));

    return pendingRsvps;
  }

  async editAdditionalOutreach(
    userId: string,
    additionalOutreachHours: number,
  ) {
    const updatedUser = await this.db
      .update(user)
      .set({ additionalOutreachHours })
      .where(eq(user.id, userId))
      .returning();
    return updatedUser.at(0);
  }

  async getAdditionalOutreach(userId: string) {
    const fetchedUser = await this.db
      .select({
        additionalOutreachHours: user.additionalOutreachHours,
      })
      .from(user)
      .where(eq(user.id, userId));
    return fetchedUser.at(0)?.additionalOutreachHours;
  }
}
