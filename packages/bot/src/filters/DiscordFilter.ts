import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  Logger,
} from "@nestjs/common";
import * as Sentry from "@sentry/node";
import { EmbedBuilder, InteractionType, codeBlock } from "discord.js";
import { NecordArgumentsHost } from "necord";
import { isTRPCClientError } from "../backend/backend.module";

@Catch()
export class DiscordExceptionFilter implements ExceptionFilter {
  public async catch(exception: Error, host: ArgumentsHost) {
    const logger = new Logger(DiscordExceptionFilter.name);
    const necordArguments =
      NecordArgumentsHost.create(host).getContext<"interactionCreate">();

    if (!Array.isArray(necordArguments)) throw exception;

    const [interaction] = necordArguments;

    if (!interaction) return;

    const descriptionWithStack = exception.stack
      ? `${exception.message}\n\n${codeBlock(exception.stack)}`
      : exception.message;

    const errorEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("An error occurred")
      .setDescription(descriptionWithStack);

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

    if (!isTRPCClientError(exception)) {
      Sentry.captureException(exception);
      logger.error(exception.message, exception.stack);
    }
  }
}
