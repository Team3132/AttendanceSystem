import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  ForbiddenException,
} from "@nestjs/common";
import { EmbedBuilder, InteractionType } from "discord.js";
import { NecordArgumentsHost } from "necord";

@Catch(ForbiddenException)
export class ForbiddenDiscordFilter implements ExceptionFilter {
  public async catch(exception: ForbiddenException, host: ArgumentsHost) {
    const necordArguments =
      NecordArgumentsHost.create(host).getContext<"interactionCreate">();

    if (!Array.isArray(necordArguments)) throw exception;

    const [interaction] = necordArguments;

    if (!interaction) return;

    const errorEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("You don't have permission to do that.");

    if (
      interaction.type === InteractionType.ApplicationCommand ||
      interaction.type === InteractionType.MessageComponent ||
      interaction.type === InteractionType.ModalSubmit
    ) {
      if (interaction.deferred) {
        await interaction.editReply({
          embeds: [errorEmbed],
        });
      } else if (interaction.replied) {
        await interaction.followUp({
          embeds: [errorEmbed],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
      }
    } else if (
      interaction.type === InteractionType.ApplicationCommandAutocomplete
    ) {
      await interaction.respond([]);
    }
  }
}
