import {
  DRIZZLE_TOKEN,
  type DrizzleDatabase,
  NewRsvp,
} from '@/drizzle/drizzle.module';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { rsvp } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RsvpService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {}
  private readonly logger = new Logger(RsvpService.name);

  createRSVP(data: NewRsvp) {
    return this.db.insert(rsvp).values(data).returning();
  }

  deleteRSVP(id: string) {
    return this.db.delete(rsvp).where(eq(rsvp.id, id)).returning();
  }

  async scanin(params: { code: string; eventId: string }) {
    const { code, eventId } = params;

    const scancode = await this.db.query.scancode.findFirst({
      where: (scancode, { eq }) => eq(scancode.code, code),
      columns: {
        userId: true,
      },
    });

    if (!scancode) throw new BadRequestException('Not a valid code');

    const { userId } = scancode;

    const checkinTime = new Date().toISOString();

    const existingRsvp = await this.db.query.rsvp.findFirst({
      where: (rsvp, { and, eq }) =>
        and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
    });

    if (existingRsvp.checkinTime)
      throw new BadRequestException('Already checked in');

    const updatedRsvp = await this.db
      .insert(rsvp)
      .values({
        id: uuid(),
        eventId,
        userId,
        checkinTime,
      })
      .onConflictDoUpdate({
        set: {
          checkinTime,
        },
        target: [rsvp.eventId, rsvp.userId],
      })
      .returning();

    return updatedRsvp.at(0);
  }
}
