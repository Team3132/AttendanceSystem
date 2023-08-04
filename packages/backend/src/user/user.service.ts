import { BotService } from '../bot/bot.service';
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { user } from '../drizzle/schema';
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
    const pendingRsvps = await this.db.query.rsvp.findMany({
      where: (rsvp, { eq }) =>
        and(
          and(eq(rsvp.userId, userId), isNull(rsvp.checkoutTime)),
          isNotNull(rsvp.checkinTime),
        ),
    });

    return pendingRsvps;
  }
}
