import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import { Context, SlashCommand, type SlashCommandContext } from "necord";
import {
  BACKEND_TOKEN,
  type BackendClient,
} from "../../backend/backend.module";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";

const guildId = process.env.VITE_GUILD_ID;

@Injectable()
export class SyncPlzCommand {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {}

  @UseGuards(GuildMemberGuard)
  @SlashCommand({
    name: "syncplz",
    description: "Send a humble request to the bot to sync the calendar.",
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    guilds: guildId ? [guildId] : undefined,
    dmPermission: false,
  })
  public async onRequestRSVP(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();

    try {
      const response = await this.backendClient.client.syncEvents.mutate();

      const embed = new EmbedBuilder()
        .setColor([0, 255, 0])
        .setTitle("Calendar Synced")
        .setDescription("Calendar synced successfully")
        .setFields([
          {
            name: "Deleted Events",
            value: response.deletedEventCount.toString(),
            inline: true,
          },
          {
            name: "Updated/Created Events",
            value: response.updatedEvents.toString(),
            inline: true,
          },
        ]);

      return interaction.editReply({
        content: "Calendar synced",
        embeds: [embed],
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      const errorEmbed = new EmbedBuilder()
        .setColor([255, 0, 0])
        .setTitle("Error")
        .setDescription(message);

      return interaction.editReply({
        content: "An error occurred",
        embeds: [errorEmbed],
      });
    }
  }
}
