import { BACKEND_TOKEN, type BackendClient } from "@/backend/backend.module";
import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { BuildPointUserSchema } from "backend/schema/BuildPointUserSchema";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import {
  Button,
  type ButtonContext,
  ComponentParam,
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
} from "necord";
import { z } from "zod";
import { AddBuildPointsOptionsDto } from "../dto/AddBuildPointsOptionsDto";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";

const leaderboardLine = (data: z.infer<typeof BuildPointUserSchema>) =>
  `${data.rank}. **${data.username}** - ${data.points}`;

function randomStr(length = 8): string {
  const alphanumericCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(
      Math.random() * alphanumericCharacters.length,
    );
    result += alphanumericCharacters[randomIndex];
  }

  return result;
}

const guildId = process.env["GUILD_ID"];

@Injectable()
export class BuildPointsPaginationButton {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {}

  @UseGuards(GuildMemberGuard)
  @Button("buildPointsLeaderboard/:toPage/:random")
  public async onPageChange(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("toPage") toPage: string,
  ) {
    const to = parseInt(toPage);

    const { embed, messageComponent } = await this.createMessage(to);

    await interaction.update({
      embeds: [embed],
      components: [messageComponent],
    });
  }

  @UseGuards(GuildMemberGuard)
  @SlashCommand({
    name: "buildpoints",
    description: "Get the leaderboard for build season points",
    guilds: guildId ? [guildId] : undefined,
    dmPermission: false,
  })
  public async onLeaderboard(@Context() [interaction]: SlashCommandContext) {
    const { embed, messageComponent } = await this.createMessage(1);

    await interaction.reply({
      embeds: [embed],
      components: [messageComponent],
    });
  }

  @UseGuards(GuildMemberGuard)
  @SlashCommand({
    name: "addbuildpoints",
    description: "Add build season points to a user",
    guilds: guildId ? [guildId] : undefined,
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    dmPermission: false,
  })
  public async onAddBuildPoints(
    @Context() [interaction]: SlashCommandContext,
    @Options() params: AddBuildPointsOptionsDto,
  ) {
    const response = await this.backendClient.client.bot.addBuildPoints.mutate({
      points: params.points,
      userId: params.user.id,
      reason: params.reason,
    });

    await interaction.reply({
      ephemeral: true,
      content: `Added ${response.points} points to ${params.user.toString()}`,
    });
  }

  public async createMessage(page: number) {
    const perPage = 10;

    const { items: leaderBoardData, total } =
      await this.backendClient.client.bot.buildPointsLeaderboard.query({
        cursor: page - 1,
        limit: perPage,
      });

    // pages start at 1
    const maxPage = Math.ceil(total / perPage);

    if (page > maxPage || page < 1) throw new Error("Invalid page");

    const embed = new EmbedBuilder()
      .setTitle(`Build Points Leaderboard ${page}/${maxPage}`)
      .setTimestamp(new Date());

    const lines = leaderBoardData.map(leaderboardLine).join("\n");

    embed.setDescription(lines);

    const messageComponent =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`buildPointsLeaderboard/${1}/${randomStr(4)}`)
          .setLabel("First")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId(`buildPointsLeaderboard/${page - 1}/${randomStr(4)}`)
          .setLabel("Previous")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 1),
        new ButtonBuilder()
          .setCustomId(`buildPointsLeaderboard/${page}/${randomStr(4)}`)
          .setLabel(`Refresh`)
          .setStyle(ButtonStyle.Primary)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId(`buildPointsLeaderboard/${page + 1}/${randomStr(4)}`)
          .setLabel("Next")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === maxPage),
        new ButtonBuilder()
          .setCustomId(`buildPointsLeaderboard/${maxPage}/${randomStr(4)}`)
          .setLabel("Last")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === maxPage),
      );

    return { embed, messageComponent };
  }
}
