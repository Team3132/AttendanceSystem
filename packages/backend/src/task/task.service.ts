import { BACKEND_TOKEN, BackendClient } from '@/backend/backend.module';
import rsvpReminderMessage from '@/bot/utils/rsvpReminderMessage';
import { ROLES } from '@/constants';
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
import { z } from 'zod';
import { RSVPSchema } from 'newbackend/schema';

@Injectable()
export class TaskService {
  constructor(
    private readonly config: ConfigService,
    private readonly discordClient: Client,
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {
    // this.handleCron(); // Run once on startup
  }

  private readonly logger = new Logger(TaskService.name);

  @Cron('00 22 * * *')
  public async handleAttendanceReminder() {
    const enabled = this.config.get('REMINDER_ENABLED');
    if (!enabled) return;

    const nextEvents = await this.backendClient.bot.getEventsInNextDay.query();

    const attendanceChannelId = this.config.getOrThrow('ATTENDANCE_CHANNEL');

    const fetchedChannel =
      await this.discordClient.channels.fetch(attendanceChannelId);

    if (!fetchedChannel.isTextBased())
      throw new Error('Attendance channel is not text based.');

    if (fetchedChannel.isDMBased())
      throw new Error('This channel is not in a server');

    if (fetchedChannel.type === ChannelType.GuildStageVoice)
      throw new Error('This channel is a stage voice channel');

    type MessageEvent = [
      message: BaseMessageOptions,
      event: Event & {
        rsvps: (z.infer<typeof RSVPSchema> & {
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
