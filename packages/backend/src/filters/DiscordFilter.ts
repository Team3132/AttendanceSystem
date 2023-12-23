import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { NecordArgumentsHost } from 'necord';
import { EmbedBuilder, InteractionType, codeBlock } from 'discord.js';
import * as Sentry from '@sentry/node';
import { isTRPCClientError } from '@/backend/backend.module';

@Catch()
export class DiscordExceptionFilter implements ExceptionFilter {
  public async catch(exception: Error, host: ArgumentsHost) {
    const logger = new Logger(DiscordExceptionFilter.name);
    const [interaction] =
      NecordArgumentsHost.create(host).getContext<'interactionCreate'>();

    const descriptionWithStack = exception.stack
      ? `${exception.message}\n\n${codeBlock(exception.stack)}`
      : exception.message;

    const errorEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('An error occurred')
      .setDescription(descriptionWithStack);

    if (interaction.type === InteractionType.ApplicationCommand) {
      if (interaction.deferred) {
        await interaction.editReply({
          embeds: [errorEmbed],
        });
      } else if (interaction.replied) {
        await interaction.followUp({
          embeds: [errorEmbed],
        });
      } else {
        await interaction.reply({
          embeds: [errorEmbed],
        });
      }
    }

    if (!isTRPCClientError(exception)) {
      Sentry.captureException(exception);
      logger.error(exception.message, exception.stack);
    }
  }
}
