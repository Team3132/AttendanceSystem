import { BACKEND_TOKEN, type BackendClient } from "@/backend/backend.module";
import rsvpReminderMessage from "@/bot/utils/rsvpReminderMessage";
import { ROLES } from "@/constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import type { EventSchema } from "../../../frontend/src/api/schema";
import {
  type BaseMessageOptions,
  ChannelType,
  Client,
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
  }

  private readonly logger = new Logger(TaskService.name);

  @Cron("00 17 * * *")
  public async handleAttendanceReminder() {
    const enabled = this.config.get("REMINDER_ENABLED");
    if (!enabled) return;

    try {
      await this.backendClient.client.bot.syncEvents.mutate();
    } catch (error) {
      this.logger.error("Failed to sync events", error);
    }

    const nextEvents =
      await this.backendClient.client.bot.getEventsInNextDay.query();

    const attendanceChannelId = this.config.getOrThrow("ATTENDANCE_CHANNEL");

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

    const messages = await Promise.all(
      nextEvents.map(async (nextEvent) => {
        const nextEventRsvps =
          await this.backendClient.client.bot.getEventRsvps.query(nextEvent.id);
        return [
          rsvpReminderMessage(
            nextEvent,
            nextEventRsvps,
            this.config.getOrThrow("FRONTEND_URL"),
          ),
          nextEvent,
        ] satisfies MessageEvent;
      }),
    );

    const sentMessages = await Promise.all(
      messages.map(([message, event]) =>
        fetchedChannel.send({
          content: `${
            event.type === "Outreach"
              ? roleMention(ROLES.OUTREACH)
              : event.type === "Mentor"
                ? roleMention(ROLES.MENTOR)
                : event.type === "Social"
                  ? roleMention(ROLES.SOCIAL)
                  : roleMention(ROLES.EVERYONE)
          } ${bold(
            "5pm reminder",
          )}: This channel should be used to let us know any last minute attendance changes on the day of the meeting.`,
          ...message,
        }),
      ),
    );

    this.logger.debug(`${sentMessages.length} reminder messages sent`);
  }
}
