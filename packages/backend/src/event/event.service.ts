import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DRIZZLE_TOKEN,
  type DrizzleDatabase,
  Event,
  NewEvent,
} from '@/drizzle/drizzle.module';
import { event, rsvp, user } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { RsvpUser } from './dto/rsvp-user.dto';
import { v4 as uuid } from 'uuid';
import randomStr from '@/utils/randomStr';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CheckoutActiveData } from './types/CheckoutActive';

@Injectable()
export class EventService {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    @InjectQueue('event')
    private readonly eventQueue: Queue<CheckoutActiveData>,
  ) {}

  async createEvent(data: Omit<NewEvent, 'secret'>) {
    const secret = randomStr(8);
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

  async checkinUser(eventId: string, userId: string, token: string) {
    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });
    if (!event) throw new NotFoundException('No event found');

    const isValid = fetchedEvent.secret === token;
    if (!isValid) throw new BadRequestException('Code not valid');

    const currentDate = new Date();

    const eventStartTime = new Date(fetchedEvent.startDate).getTime();

    const checkinTime =
      currentDate.getTime() <= eventStartTime
        ? fetchedEvent.startDate
        : currentDate.toISOString();

    const eventEndTime = new Date(fetchedEvent.endDate).getTime();

    const delay = eventEndTime - currentDate.getTime();

    const existingRsvp = await this.db.query.rsvp.findFirst({
      where: (rsvp, { and, eq }) =>
        and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
    });

    if (!existingRsvp) {
      const newRsvp = await this.db
        .insert(rsvp)
        .values({
          id: uuid(),
          userId,
          eventId,
          checkinTime,
        })
        .returning();

      const firstNewRsvp = newRsvp.at(0);

      if (!firstNewRsvp) {
        throw new BadRequestException('Error creating RSVP');
      }

      await this.eventQueue.add(
        'checkoutActive',
        {
          eventId,
          rsvpId: firstNewRsvp.id,
        },
        {
          delay,
          jobId: firstNewRsvp.id,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );

      return firstNewRsvp;
    }

    if (existingRsvp.checkinTime !== null) {
      throw new BadRequestException('User already checked in');
    }

    const upsertedRsvp = await this.db
      .insert(rsvp)
      .values({
        id: uuid(),
        eventId,
        userId,
        checkinTime,
      })
      .onConflictDoUpdate({
        target: [rsvp.eventId, rsvp.userId],
        set: {
          checkinTime,
        },
      })
      .returning();

    const firstResult = upsertedRsvp.at(0);

    if (firstResult) {
      await this.eventQueue.add(
        'checkoutActive',
        {
          eventId,
          rsvpId: firstResult.id,
        },
        {
          delay,
          jobId: firstResult.id,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }

    return upsertedRsvp;
  }

  async checkoutUser(eventId: string, userId: string) {
    const currentDate = new Date();

    const checkoutTime = currentDate.toISOString();

    const checkedInRsvp = await this.db.query.rsvp.findFirst({
      where: (rsvp, { and, eq }) =>
        and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
    });

    if (!checkedInRsvp) throw new NotFoundException('No RSVP found');

    if (checkedInRsvp.checkoutTime) {
      throw new BadRequestException('User already checked out');
    }

    const updatedRsvp = await this.db
      .update(rsvp)
      .set({
        checkoutTime,
      })
      .where(eq(rsvp.id, checkedInRsvp.id))
      .returning();

    const firstUpdated = updatedRsvp.at(0);

    if (!firstUpdated) throw new NotFoundException('No RSVP found');

    return firstUpdated;
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
        checkinTime: rsvp.checkinTime,
        checkoutTime: rsvp.checkoutTime,
      })
      .from(rsvp)
      .where(eq(rsvp.eventId, eventId))
      .leftJoin(user, eq(rsvp.userId, user.id))
      .orderBy(rsvp.status, rsvp.updatedAt);

    return res;
  }
}
