import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DRIZZLE_TOKEN,
  type DrizzleDatabase,
  Event,
  NewEvent,
  User,
} from '@/drizzle/drizzle.module';
import { event, rsvp, user } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { RsvpUser } from './dto/rsvp-user.dto';
import { v4 as uuid } from 'uuid';
import randomStr from '@/utils/randomStr';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CheckoutActiveData } from './types/CheckoutActive';
import { ROLES } from '@/constants';
import { UpdateRsvpDto } from '@/rsvp/dto/update-rsvp.dto';

@Injectable()
export class EventService {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    @InjectQueue('event')
    private readonly eventQueue: Queue<CheckoutActiveData>,
  ) {}

  private readonly logger = new Logger(EventService.name);

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

  /**
   * Check in a user to an event optionally using a secret token
   * @param eventId The event id
   * @param userId The user id
   * @param token The secret token to verify if using a secret
   * @returns RSVP
   */
  async checkinUserWithToken(eventId: string, userId: string, token: string) {
    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });
    if (!event) throw new NotFoundException('No event found');
    const fetchedUser = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });
    if (!fetchedUser) throw new NotFoundException('No user found');

    if (fetchedEvent.type === 'Mentor') {
      if (!fetchedUser.roles.includes(ROLES.MENTOR)) {
        throw new BadRequestException('You are not a mentor');
      }
    }

    const isValid = fetchedEvent.secret === token;
    if (!isValid) throw new BadRequestException('Code not valid');

    const checkedIn = await this.checkin(fetchedUser, fetchedEvent);

    this.logger.debug(
      `Checked in ${fetchedUser.username} to ${fetchedEvent.title} using token`,
    );

    return checkedIn;
  }

  /**
   *
   * @param eventId The event id
   * @param userId The user id
   * @param scancode The scancode used to identify the user to checkin
   */
  async checkinUserWithScancode(eventId: string, scancodeInput: string) {
    const fetchedScancode = await this.db.query.scancode.findFirst({
      where: (scancode, { eq }) => eq(scancode.code, scancodeInput),
    });

    if (!fetchedScancode) throw new NotFoundException('No scancode found');

    const { userId } = fetchedScancode;

    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });
    if (!event) throw new NotFoundException('No event found');
    const fetchedUser = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });
    if (!fetchedUser) throw new NotFoundException('No user found');

    if (fetchedEvent.type === 'Mentor') {
      if (!fetchedUser.roles.includes(ROLES.MENTOR)) {
        throw new BadRequestException('You are not a mentor');
      }
    }

    const checkedIn = await this.checkin(fetchedUser, fetchedEvent);

    this.logger.debug(
      `Checked in ${fetchedUser.username} to ${fetchedEvent.title} using scancode`,
    );

    return checkedIn;
  }

  /**
   * Check in a user to an event
   * @param fetchedUser The user to check in
   * @param fetchedEvent The event to check in to
   * @returns RSVP
   */
  private async checkin(fetchedUser: User, fetchedEvent: Event) {
    const currentDate = new Date();

    const eventStartTime = new Date(fetchedEvent.startDate).getTime();

    const checkinTime =
      currentDate.getTime() <= eventStartTime
        ? fetchedEvent.startDate
        : currentDate.toISOString();

    const eventEndTime = new Date(fetchedEvent.endDate).getTime();

    const timeDiff = eventEndTime - currentDate.getTime();

    const delay = timeDiff > 0 ? timeDiff : 0;

    const existingRsvp = await this.db.query.rsvp.findFirst({
      where: (rsvp, { and, eq }) =>
        and(eq(rsvp.eventId, fetchedEvent.id), eq(rsvp.userId, fetchedUser.id)),
    });

    if (!existingRsvp) {
      const newRsvp = await this.db
        .insert(rsvp)
        .values({
          id: uuid(),
          userId: fetchedUser.id,
          eventId: fetchedEvent.id,
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
          eventId: fetchedEvent.id,
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
        eventId: fetchedEvent.id,
        userId: fetchedUser.id,
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
          eventId: fetchedEvent.id,
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

    return firstResult;
  }

  /**
   * Check out a user from an event
   * @param eventId The event id
   * @param userId The user id
   * @returns RSVP
   */
  async checkoutUser(eventId: string, userId: string) {
    const fetchedRsvp = await this.db.query.rsvp.findFirst({
      where: (rsvp, { and, eq }) =>
        and(eq(rsvp.eventId, eventId), eq(rsvp.userId, userId)),
    });

    if (!fetchedRsvp) throw new NotFoundException('No RSVP found');

    if (fetchedRsvp.checkoutTime !== null) {
      throw new BadRequestException('User already checked out');
    }

    await this.eventQueue.add(
      'checkoutActive',
      {
        eventId: eventId,
        rsvpId: fetchedRsvp.id,
      },
      {
        delay: 0,
        jobId: fetchedRsvp.id,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    this.logger.debug(
      `Checked out ${fetchedRsvp.userId} from ${fetchedRsvp.eventId}`,
    );
  }

  async checkinRsvp(eventId: string, rsvpId: string) {
    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });
    if (!fetchedEvent) throw new NotFoundException('No event found');
    const fetchedRsvp = await this.db.query.rsvp.findFirst({
      where: (rsvp, { eq }) => eq(rsvp.id, rsvpId),
    });
    if (!fetchedRsvp) throw new NotFoundException('No rsvp found');
    const fetchedUser = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, fetchedRsvp.userId),
    });
    if (!fetchedUser) throw new NotFoundException('No user found');

    const checkedIn = await this.checkin(fetchedUser, fetchedEvent);

    return checkedIn;
  }

  async checkinUser(eventId: string, userId: string) {
    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });
    if (!fetchedEvent) throw new NotFoundException('No event found');
    const fetchedUser = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });
    if (!fetchedUser) throw new NotFoundException('No user found');

    const checkedIn = await this.checkin(fetchedUser, fetchedEvent);

    return checkedIn;
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

  async updateRsvp(eventId: string, rsvpId: string, data: UpdateRsvpDto) {
    const updatedRsvp = await this.db
      .update(rsvp)
      .set(data)
      .where(eq(rsvp.id, rsvpId))
      .returning();

    const firstResult = updatedRsvp.at(0);

    if (!firstResult) throw new NotFoundException('No RSVP found');

    return firstResult;
  }
}
