import { generateMessage } from "@/server/services/botService";
import { markEventPosted } from "@/server/services/events.service";
import { trytm } from "@/utils/trytm";
import {
  type APIApplicationCommandInteractionDataStringOption,
  type APIChatInputApplicationCommandInteractionData,
  ApplicationCommandOptionType,
  MessageFlags,
} from "@discordjs/core";
import type { Context } from "hono";
import { type JSONReply, reply } from "../interactionReply";

export async function requestRSVPCommand(
  c: Context,
  interaction: APIChatInputApplicationCommandInteractionData,
): Promise<JSONReply> {
  const meetingStringOption = interaction.options?.find(
    (option) =>
      option.type === ApplicationCommandOptionType.String &&
      option.name === "meeting",
  ) as APIApplicationCommandInteractionDataStringOption | undefined;

  const meetingId = meetingStringOption?.value;

  if (!meetingId) {
    return reply(c, {
      content: "Please provide a meeting ID.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const [response, err] = await trytm(
    generateMessage(meetingId),
  );

  const [_, eventPostedError] = await trytm(markEventPosted(meetingId));

  if (eventPostedError) {
    console.error(`Error marking event as posted: ${eventPostedError.message}`);
    return reply(c, {
      content: "Failed to mark event as posted.",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (err) {
    return reply(c, {
      content: "Failed to generate RSVP message.",
      flags: MessageFlags.Ephemeral,
    });
  }

  return reply(c, {
    content: response.content,
    embeds: response.embeds,
    components: response.components,
    allowed_mentions: response.allowed_mentions,
  });
}
