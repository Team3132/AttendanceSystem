import { AuthenticatorService } from '@/authenticator/authenticator.service';
import { rsvpReminderMessage } from '@/bot/bot.service';
import { ROLES } from '@/constants';
import { GcalService } from '@/gcal/gcal.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { bold, Client } from 'discord.js';
import { DateTime } from 'luxon';

@Injectable()
export class TaskService {
  constructor(
    private readonly gcal: GcalService,
    private readonly db: PrismaService,
    private readonly authenticatorService: AuthenticatorService,
    private readonly config: ConfigService,
    private readonly discordClient: Client,
  ) {}

  private readonly logger = new Logger(TaskService.name);

  // @Cron('45 * * * * *')
  @Cron('00 23 * * *')
  async handleCron() {
    this.logger.debug('Updating events');
    const events = await this.gcal.events();
    const databaseEvents = await Promise.all(
      events.items.map((event) => {
        const secret = this.authenticatorService.generateSecret();
        const isMentorEvent = event.summary.toLowerCase().includes('mentor');
        return this.db.event.upsert({
          where: {
            id: event.id,
          },
          update: {
            title: event.summary,
            allDay: !event.start.dateTime && !event.end.dateTime,
            roles: isMentorEvent ? [ROLES.MENTOR] : [],
            startDate:
              event.start.dateTime ??
              DateTime.fromISO(event.start.date).startOf('day').toJSDate(),
            endDate:
              event.end.dateTime ??
              DateTime.fromISO(event.end.date).endOf('day').toJSDate(),
            description: event.description,
          },
          create: {
            id: event.id,
            title: event.summary,
            roles: isMentorEvent ? [ROLES.MENTOR] : [],
            allDay: !event.start.dateTime && !event.end.dateTime,
            startDate:
              event.start.dateTime ??
              DateTime.fromISO(event.start.date).startOf('day').toJSDate(),
            endDate:
              event.end.dateTime ??
              DateTime.fromISO(event.end.date).endOf('day').toJSDate(),
            description: event.description,
            secret,
          },
        });
      }),
    );
    this.logger.log(`${databaseEvents.length} events updated/created`);
  }

  @Cron('00 22 * * *')
  async handleAttendanceReminder() {
    const enabled = this.config.get('REMINDER_ENABLED');
    if (!enabled) return;

    const startNextDay = DateTime.now().plus({ day: 1 }).startOf('day');

    const endNextDay = startNextDay.endOf('day');

    const nextEvents = await this.db.event.findMany({
      where: {
        AND: [
          {
            startDate: { gte: startNextDay.toJSDate() },
          },
          {
            startDate: {
              lte: endNextDay.toJSDate(),
            },
          },
        ],
      },
      include: {
        RSVP: {
          include: {
            user: {
              select: {
                username: true,
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

    const messages = nextEvents.map((event) =>
      rsvpReminderMessage(
        event,
        event.RSVP,
        this.config.get('FRONTEND_URL'),
        fetchedChannel.guild.roles.everyone.id,
      ),
    );

    const sentMessages = await Promise.all(
      messages.map((message) =>
        fetchedChannel.send({
          content: `${fetchedChannel.guild.roles.everyone.toString()} ${bold(
            `10pm reminder`,
          )}: This channel should be used to let us know any last minute attendance changes on the day of the meeting.`,
          ...message,
        }),
      ),
    );

    this.logger.debug(`${sentMessages.length} reminder messages sent`);
  }
}
