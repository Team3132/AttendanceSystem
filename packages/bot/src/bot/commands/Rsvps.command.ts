import { BACKEND_TOKEN, type BackendClient } from "@/backend/backend.module";
import { Inject, Injectable, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from "necord";
import type { AttendanceDto } from "../dto/attendance.dto";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";
import { EventAutocompleteInterceptor } from "../interceptors/event.interceptor";
import rsvpToDescription from "../utils/rsvpToDescription";

const guildId = process.env.GUILD_ID;

@Injectable()
export class RsvpsCommand {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(GuildMemberGuard)
  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: "rsvps",
    description: "Get the rsvps for a meeting.",
    guilds: guildId ? [guildId] : undefined,
    dmPermission: false,
  })
  public async onRSVPs(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting }: AttendanceDto,
  ) {
    const fetchedMeeting =
      await this.backendClient.client.bot.getEventDetails.query(meeting);

    if (!fetchedMeeting)
      return interaction.reply({ content: "Unknown event", ephemeral: true });

    const fetchedRSVPs =
      await this.backendClient.client.bot.getEventRsvps.query(meeting);

    if (!fetchedRSVPs.length)
      return interaction.reply({ content: "No RSVPs", ephemeral: true });

    const description = fetchedRSVPs
      .map((rsvp) => rsvpToDescription(rsvp.user.username, rsvp.status))
      .join("\n");

    const rsvpEmbed = new EmbedBuilder()
      .setTitle(
        `RSVPs for ${fetchedMeeting.title} at ${DateTime.fromMillis(
          Date.parse(fetchedMeeting.startDate),
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get("FRONTEND_URL")}/events/${fetchedMeeting.id}`);

    return interaction.reply({
      embeds: [rsvpEmbed],
    });
  }
}
