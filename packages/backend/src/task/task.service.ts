import rsvpReminderMessage from '@/bot/utils/rsvpReminderMessage';
import { ROLES } from '@/constants';
import {
  DRIZZLE_TOKEN,
  type DrizzleDatabase,
  Event,
  NewEvent,
  Rsvp,
} from '@/drizzle/drizzle.module';
import { GcalService } from '@/gcal/gcal.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import {
  BaseMessageOptions,
  bold,
  ChannelType,
  Client,
  roleMention,
} from 'discord.js';
import { between, gte, inArray, lte, sql } from 'drizzle-orm';
import { DateTime } from 'luxon';
import { event, rsvp } from '../drizzle/schema';
import randomStr from '@/utils/randomStr';

@Injectable()
export class TaskService {
  constructor(
    private readonly gcal: GcalService,
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
    private readonly discordClient: Client,
  ) {
    this.handleCron(); // Run once on startup
  }

  private readonly logger = new Logger(TaskService.name);

  // @Cron('45 * * * * *')
  @Cron('00 23 * * *')
  async handleCron() {
    this.logger.debug('Updating events');
    const events = await this.gcal.events();

    /** Existing events in the next month */
    // const currentSyncedEventIds = await this.db.query.event.findMany({
    //   where: {
    //     startDate: {
    //       gte: DateTime.now().toJSDate(),
    //     },
    //     endDate: {
    //       lte: DateTime.now().plus({ month: 1 }).toJSDate(),
    //     },
    //     isSyncedEvent: {
    //       equals: true,
    //     },
    //   },
    // });
    const currentSyncedEventIds = await this.db.query.event.findMany({
      where: (event, { and, eq }) =>
        and(
          gte(event.startDate, DateTime.now().toISO()),
          lte(event.endDate, DateTime.now().plus({ month: 1 }).toISO()),
          eq(event.isSyncedEvent, true),
        ),
    });

    /** Deleted Events */
    const deletedEventIds = currentSyncedEventIds
      .filter((event) => {
        return !events.items.find((item) => item.id === event.id);
      })
      .map((event) => event.id);

    const deletedEvents = deletedEventIds.length
      ? await this.db
          .delete(event)
          .where(inArray(event.id, deletedEventIds))
          .returning({
            count: sql<number>`COUNT(*)`.mapWith(Number),
          })
      : [];

    const deletedEventCount = deletedEvents.at(0)?.count ?? 0;

    this.logger.debug(`Deleted ${deletedEventCount} events`);

    const databaseEvents = await Promise.all(
      events.items.map((gcalEvent) => {
        const secret = randomStr(8);

        const isMentorEvent = gcalEvent.summary
          .toLowerCase()
          .includes('mentor');

        const isOutreachEvent = gcalEvent.summary
          .toLowerCase()
          .includes('outreach');

        const isSocialEvent = gcalEvent.summary
          .toLowerCase()
          .includes('social');

        const eventType = isOutreachEvent
          ? 'Outreach'
          : isMentorEvent
          ? 'Mentor'
          : isSocialEvent
          ? 'Social'
          : 'Regular';

        const newEvent = {
          id: gcalEvent.id,
          title: gcalEvent.summary,
          allDay: !gcalEvent.start.dateTime && !gcalEvent.end.dateTime,
          startDate: gcalEvent.start.dateTime
            ? gcalEvent.start.dateTime
            : DateTime.fromISO(gcalEvent.start.date).startOf('day').toISO(),
          endDate: gcalEvent.end.dateTime
            ? gcalEvent.end.dateTime
            : DateTime.fromISO(gcalEvent.end.date).endOf('day').toISO(),
          description: gcalEvent.description,
          type: eventType,
          isSyncedEvent: true,
          secret,
        } satisfies NewEvent;

        const updatedEvent = {
          title: gcalEvent.summary,
          allDay: !gcalEvent.start.dateTime && !gcalEvent.end.dateTime,
          startDate: gcalEvent.start.dateTime
            ? gcalEvent.start.dateTime
            : DateTime.fromISO(gcalEvent.start.date).startOf('day').toISO(),
          endDate: gcalEvent.end.dateTime
            ? gcalEvent.end.dateTime
            : DateTime.fromISO(gcalEvent.end.date).endOf('day').toISO(),
          description: gcalEvent.description,
          type: eventType,
          isSyncedEvent: true,
        } satisfies Partial<NewEvent>;

        return this.db
          .insert(event)
          .values(newEvent)
          .onConflictDoUpdate({
            set: updatedEvent,
            target: [event.id],
          })
          .returning();
      }),
    );
    this.logger.log(`${databaseEvents.length} events updated/created`);
  }

  @Cron('00 22 * * *')
  public async handleAttendanceReminder() {
    const enabled = this.config.get('REMINDER_ENABLED');
    if (!enabled) return;

    const startNextDay = DateTime.now().plus({ day: 1 }).startOf('day');

    const endNextDay = startNextDay.endOf('day');

    const nextEvents = await this.db.query.event.findMany({
      where: (event) =>
        between(event.startDate, startNextDay.toISO(), endNextDay.toISO()),
      with: {
        rsvps: {
          orderBy: [rsvp.status, rsvp.updatedAt],
          with: {
            user: {
              columns: {
                username: true,
                roles: true,
              },
            },
          },
        },
      },
    });

    const attendanceChannelId = this.config.getOrThrow('ATTENDANCE_CHANNEL');

    const attendanceChannel =
      this.discordClient.channels.cache.get(attendanceChannelId) ??
      this.discordClient.channels.fetch(attendanceChannelId);

    const fetchedChannel = await attendanceChannel;

    if (!fetchedChannel.isTextBased())
      throw new Error('Attendance channel is not text based.');

    if (fetchedChannel.isDMBased())
      throw new Error('This channel is not in a server');

    if (fetchedChannel.type === ChannelType.GuildStageVoice)
      throw new Error('This channel is a stage voice channel');

    type MessageEvent = [
      message: BaseMessageOptions,
      event: Event & {
        rsvps: (Rsvp & {
          user: {
            username: string;
            roles: string[];
          };
        })[];
      },
    ];

    const messages = nextEvents.map(
      (nextEvent) =>
        [
          rsvpReminderMessage(
            nextEvent,
            nextEvent.rsvps,
            this.config.get('FRONTEND_URL'),
          ),
          nextEvent,
        ] satisfies MessageEvent,
    );

    const sentMessages = await Promise.all(
      messages.map(([message, event]) =>
        fetchedChannel.send({
          content: `${
            event.type === 'Outreach'
              ? roleMention(ROLES.OUTREACH)
              : event.type === 'Mentor'
              ? roleMention(ROLES.MENTOR)
              : event.type === 'Social'
              ? roleMention(ROLES.SOCIAL)
              : roleMention(ROLES.EVERYONE)
          } ${bold(
            `10pm reminder`,
          )}: This channel should be used to let us know any last minute attendance changes on the day of the meeting.`,
          ...message,
        }),
      ),
    );

    this.logger.debug(`${sentMessages.length} reminder messages sent`);
  }
}
