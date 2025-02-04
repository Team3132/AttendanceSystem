import { Inject, Injectable, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import {
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from "necord";
import {
  BACKEND_TOKEN,
  type BackendClient,
} from "../../backend/backend.module";
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
    try {
      await this.backendClient.client.markEventPosted.mutate(meeting);

      const reminderMessage =
        await this.backendClient.client.getEventReminder.query(meeting);
      return interaction.reply({
        content: reminderMessage.content,
        components: reminderMessage.components,
        embeds: reminderMessage.embeds,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      const errorEmbed = new EmbedBuilder()
        .setColor([255, 0, 0])
        .setTitle("Error")
        .setDescription(message);
      if (interaction.replied) {
        await interaction.followUp({
          content: "An error occurred",
          embeds: [errorEmbed],
        });
      } else {
        await interaction.reply({
          content: "An error occurred",
          embeds: [errorEmbed],
        });
      }
    }
  }
}
