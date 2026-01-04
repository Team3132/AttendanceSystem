import { syncEvents } from "@/server/services/calalendarSync.service";
import { trytm } from "@/utils/trytm";
import { EmbedBuilder } from "@discordjs/builders";
import {
  type APIChatInputApplicationCommandInteractionData,
  MessageFlags,
} from "@discordjs/core";
import { type JSONReply, reply } from "../interactionReply";

export async function syncplzCommand(
  _interaction: APIChatInputApplicationCommandInteractionData,
): Promise<JSONReply> {
  const [response, err] = await trytm(syncEvents());

  if (err) {
    return reply({
      content: err.message,
      flags: MessageFlags.Ephemeral,
    });
  }

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

  return reply({
    content: "Calendar synced",
    embeds: [embed.toJSON()],
  });
}
