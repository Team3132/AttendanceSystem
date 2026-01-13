import type { LeaderBoardUser } from "@/server/schema";
import { getOutreachTime } from "@/server/services/outreach.service";
import { randomStr } from "@/server/utils/randomStr";
import { trytm } from "@/utils/trytm";
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "@discordjs/builders";
import {
  type APIChatInputApplicationCommandInteractionData,
  ButtonStyle,
  MessageFlags,
} from "@discordjs/core";
import { Duration } from "luxon";
import type z from "zod";
import { type JSONReply, reply } from "../interactionReply";

export async function leaderboardCommand(
  _interaction: APIChatInputApplicationCommandInteractionData,
): Promise<JSONReply> {
  const [leaderboardPageEmbed, leaderboardPageError] = await trytm(
    createOutreachEmbedPage(1),
  );

  if (leaderboardPageError) {
    console.error(
      `Error creating outreach embed page: ${leaderboardPageError.message}`,
    );
    return reply({
      content: "Failed to fetch leaderboard page.",
      flags: MessageFlags.Ephemeral,
    });
  }
  return reply({
    embeds: [leaderboardPageEmbed.embed.toJSON()],
    components: [leaderboardPageEmbed.messageComponent.toJSON()],
  });
}

export const createOutreachEmbedPage = async (page: number) => {
  const perPage = 10;

  const [leaderboardResponse, leaderboardError] = await trytm(
    getOutreachTime({
      cursor: page - 1,
      limit: perPage,
    }),
  );

  if (leaderboardError) {
    throw new Error(
      `Error fetching outreach leaderboard: ${leaderboardError.message}`,
    );
  }

  const { items: leaderBoardData, total } = leaderboardResponse;

  // pages start at 1
  const maxPage = Math.ceil(total / perPage);

  if (maxPage === 0) {
    throw new Error("No data available for the leaderboard");
  }

  if (page > maxPage || page < 1) throw new Error("Invalid page");

  const embed = new EmbedBuilder()
    .setTitle(`Outreach Leaderboard ${page}/${maxPage}`)
    .setTimestamp(new Date());

  const lines = leaderBoardData.map(leaderboardLine).join("\n");

  embed.setDescription(lines);

  const messageComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`leaderboard/${1}/${randomStr(4)}`)
      .setLabel("First")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`leaderboard/${page - 1}/${randomStr(4)}`)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`leaderboard/${page}/${randomStr(4)}`)
      .setLabel("Refresh")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(false),
    new ButtonBuilder()
      .setCustomId(`leaderboard/${page + 1}/${randomStr(4)}`)
      .setLabel("Next")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === maxPage),
    new ButtonBuilder()
      .setCustomId(`leaderboard/${maxPage}/${randomStr(4)}`)
      .setLabel("Last")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === maxPage),
  );

  return { embed, messageComponent };
};

const leaderboardLine = (data: z.infer<typeof LeaderBoardUser>) =>
  `${data.rank}. **${data.username}** - ${roundDuration(
    Duration.fromISO(data.duration),
  ).toHuman()}`;

const roundDuration = (duration: Duration) => {
  const millis = duration.toMillis();
  // round to the nearest minute
  const rounded = Math.round(millis / 60000) * 60000;
  const hours = Math.floor(rounded / 3600000);
  const minutes = Math.floor((rounded % 3600000) / 60000);
  return Duration.fromObject({ hours, minutes });
};
