import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { type BaseMessageOptions, ChannelType, Client } from "discord.js";
import { EventSchema } from "frontend";
import { z } from "zod";
import { BACKEND_TOKEN, type BackendClient } from "../backend/backend.module";
import rsvpReminderMessage from "../bot/utils/rsvpReminderMessage";
import { ROLES } from "../constants";

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
}
