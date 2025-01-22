import { BACKEND_TOKEN, BackendClient } from "@/backend/backend.module";
import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";
import { Context, SlashCommand, SlashCommandContext } from "necord";
import { PermissionFlagsBits } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

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

    const response = await this.backendClient.client.bot.syncEvents.mutate();

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
  }
}
