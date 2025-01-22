import { BACKEND_TOKEN, type BackendClient } from "@/backend/backend.module";
import rsvpReminderMessage from "@/bot/utils/rsvpReminderMessage";
import { ROLES } from "@/constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import type { EventSchema } from "frontend";
import {
  type BaseMessageOptions,
  ChannelType,
  type Client,
  bold,
  roleMention,
} from "discord.js";
import type { z } from "zod";

@Injectable()
export class TaskService {
  constructor(
    private readonly config: ConfigService,
    private readonly discordClient: Client,
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {
    // this.handleCron(); // Run once on startup
    this.handleSync();
  }

  private readonly logger = new Logger(TaskService.name);

  @Cron("00 23 * * *")
  public async handleSync() {
    try {
      await this.backendClient.client.bot.syncEvents.mutate();
    } catch (error) {
      this.logger.error("Failed to sync events", error);
    }
  }

  @Cron("00 17 * * *")
  public async handleAttendanceReminder() {
    const enabled = this.config.get("VITE_REMINDER_ENABLED");
    if (!enabled) return;

    try {
      await this.backendClient.client.bot.syncEvents.mutate();
    } catch (error) {
      this.logger.error("Failed to sync events", error);
    }

    const nextEvents =
      await this.backendClient.client.bot.getEventsInNextDay.query();

    const attendanceChannelId = this.config.getOrThrow(
      "VITE_ATTENDANCE_CHANNEL",
    );

    const fetchedChannel =
      await this.discordClient.channels.fetch(attendanceChannelId);

    if (!fetchedChannel) throw new Error("Attendance channel does not exist.");

    if (!fetchedChannel.isTextBased())
      throw new Error("Attendance channel is not text based.");

    if (fetchedChannel.isDMBased())
      throw new Error("This channel is not in a server");

    if (fetchedChannel.type === ChannelType.GuildStageVoice)
      throw new Error("This channel is a stage voice channel");

    type MessageEvent = [
      message: BaseMessageOptions,
      event: z.infer<typeof EventSchema>,
    ];

    const upcomingEvents = await this.backendClient.client.bot.getEventsInNextDay.query();

    const eventIds = upcomingEvents.map((event) => event.id);

    const eventReminderRequests = eventIds.map((eventId) =>
      this.backendClient.client.bot.getEventReminder.query(eventId),
    );

    const eventReminders = await Promise.all(eventReminderRequests);

    const sentMessages = await Promise.all(eventReminders.map((message) =>
        fetchedChannel.send(
          message
        )
      )
    );

    this.logger.debug(`${sentMessages.length} reminder messages sent`);
  }
}
