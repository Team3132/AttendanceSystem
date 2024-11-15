import { BACKEND_TOKEN, type BackendClient } from "@/backend/backend.module";
import { Inject, Injectable, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PermissionFlagsBits } from "discord.js";
import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from "necord";
import { RequestRSVPDto } from "../dto/requestRSVP.dto";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";
import { EventAutocompleteInterceptor } from "../interceptors/event.interceptor";
import rsvpReminderMessage from "../utils/rsvpReminderMessage";

const guildId = process.env.VITE_GUILD_ID;

@Injectable()
export class RequestRsvpCommand {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(GuildMemberGuard)
  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: "requestrsvp",
    description: "Send a message for people to RSVP to a specific event.",
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    guilds: guildId ? [guildId] : undefined,
    dmPermission: false,
  })
  public async onRequestRSVP(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting }: RequestRSVPDto,
  ) {
    const eventDetails =
      await this.backendClient.client.bot.getEventDetails.query(meeting);

    if (!eventDetails)
      return interaction.reply({
        ephemeral: true,
        content: "No meeting with that Id",
      });

    const fetchedRSVPs =
      await this.backendClient.client.bot.getEventRsvps.query(meeting);

    await this.backendClient.client.bot.markEventPosted.mutate(meeting);

    return interaction.reply(
      rsvpReminderMessage(
        eventDetails,
        fetchedRSVPs,
        this.config.getOrThrow("VITE_FRONTEND_URL"),
      ),
    );
  }
}
