import type { DB } from "@/server/drizzle/db";
import { generateMessage } from "@/server/services/botService";
import { markEventPosted } from "@/server/services/events.service";
import { logger } from "@/utils/logger";
import { trytm } from "@/utils/trytm";
import {
  type APIApplicationCommandInteractionDataStringOption,
  type APIChatInputApplicationCommandInteractionData,
  ApplicationCommandOptionType,
  MessageFlags,
} from "@discordjs/core";
import { type JSONReply, reply } from "../interactionReply";

export async function requestRSVPCommand(
  interaction: APIChatInputApplicationCommandInteractionData,
  db: DB,
): Promise<JSONReply> {
  const meetingStringOption = interaction.options?.find(
    (option) =>
      option.type === ApplicationCommandOptionType.String &&
      option.name === "meeting",
  ) as APIApplicationCommandInteractionDataStringOption | undefined;

  const meetingId = meetingStringOption?.value;

  if (!meetingId) {
    return reply({
      content: "Please provide a meeting ID.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const [response, err] = await trytm(generateMessage(db, meetingId));

  const [_, eventPostedError] = await trytm(markEventPosted(meetingId));

  if (eventPostedError) {
    logger.error(`Error marking event as posted: ${eventPostedError.message}`);
    return reply({
      content: "Failed to mark event as posted.",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (err) {
    return reply({
      content: "Failed to generate RSVP message.",
      flags: MessageFlags.Ephemeral,
    });
  }

  return reply({
    content: response.content,
    embeds: response.embeds,
    components: response.components,
    allowed_mentions: response.allowed_mentions,
  });
}
