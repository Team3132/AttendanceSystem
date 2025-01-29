import {
  BACKEND_TOKEN,
  type BackendClient,
} from "../../backend/backend.module";
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

    await this.backendClient.client.bot.markEventPosted.mutate(meeting);

    const reminderMessage =
      await this.backendClient.client.bot.getEventReminder.query(meeting);

    return interaction.reply({
      content: reminderMessage.content,
      components: reminderMessage.components,
      embeds: reminderMessage.embeds,
    });
  }
}
