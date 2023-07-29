import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticatorService } from '@authenticator/authenticator.service';
import { RsvpService } from '@rsvp/rsvp.service';
import {
  DRIZZLE_TOKEN,
  type DrizzleDatabase,
  Event,
  NewEvent,
} from '@/drizzle/drizzle.module';
import { event, rsvp, user } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { RsvpUser } from './dto/rsvp-user.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EventService {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly authenticatorService: AuthenticatorService,
    private readonly rsvpService: RsvpService,
  ) {}

  async createEvent(data: Omit<NewEvent, 'secret'>) {
    const secret = this.authenticatorService.generateSecret();
    const newEvent = await this.db
      .insert(event)
      .values({
        ...data,
        secret,
      })
      .returning();
    return newEvent.at(0);
  }

  async deleteEvent(id: Event['id']) {
    const deletedEvents = await this.db
      .delete(event)
      .where(eq(event.id, id))
      .returning();
    return deletedEvents.at(0);
  }

  async verifyUserEventToken(eventId: string, userId: string, token: string) {
    const event = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });
    if (!event) throw new NotFoundException('No event found');

    const isValid = this.authenticatorService.verifyToken(event.secret, token);
    if (!isValid) throw new BadRequestException('Code not valid');

    // const rsvp = this.rsvpService.upsertRSVP({
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
    //     event: {
    //       connect: {
    //         id: eventId,
    //       },
    //     },
    //     user: {
    //       connect: {
    //         id: userId,
    //       },
    //     },
    //   },
    // });

    const upsertedRsvp = await this.db
      .insert(rsvp)
      .values({
        id: uuid(),
        eventId,
        userId,
        attended: true,
      })
      .onConflictDoUpdate({
        target: [rsvp.eventId, rsvp.userId],
        set: {
          attended: true,
        },
      })
      .returning();

    return upsertedRsvp;
  }

  async getEventUserRsvps(eventId: string): Promise<RsvpUser[]> {
    const res = await this.db
      .select({
        id: rsvp.id,
        status: rsvp.status,
        delay: rsvp.delay,
        userId: rsvp.userId,
        user: {
          username: user.username,
          id: user.id,
          roles: user.roles,
        },
        eventId: rsvp.eventId,
        createdAt: rsvp.createdAt,
        updatedAt: rsvp.updatedAt,
        attended: rsvp.attended,
      })
      .from(rsvp)
      .where(eq(rsvp.eventId, eventId))
      .leftJoin(user, eq(rsvp.userId, user.id))
      .orderBy(rsvp.status, rsvp.updatedAt);

    return res;
  }
}
