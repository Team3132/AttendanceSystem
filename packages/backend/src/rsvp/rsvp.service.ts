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
import { rsvp } from '../../drizzle/schema';
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

    // const rsvp = this.prismaService.rSVP.upsert({
    //   where: {
    //     eventId_userId: {
    //       eventId,
    //       userId,
    //     },
    //   },
    //   update: {
    //     attended: true,
    //   },
    //   create: {
    //     attended: true,
    //     eventId,
    //     userId,
    //   },
    // });

    const updatedRsvp = await this.db
      .insert(rsvp)
      .values({
        id: uuid(),
        eventId,
        userId,
        attended: true,
      })
      .onConflictDoUpdate({
        set: {
          attended: true,
        },
        target: [rsvp.eventId, rsvp.userId],
      })
      .returning();

    return updatedRsvp.at(0);
  }
}
