import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { NecordArgumentsHost } from 'necord';
import { BaseInteraction } from 'discord.js';
import * as Sentry from '@sentry/node';

@Catch()
export class DiscordExceptionFilter implements ExceptionFilter {
  public async catch(exception: Error, host: ArgumentsHost) {
    const [interaction] = NecordArgumentsHost.create(host).getContext();

    if (
      interaction &&
      interaction instanceof BaseInteraction &&
      interaction.isRepliable()
    ) {
      Sentry.captureException(exception);
      return await interaction.reply({
        content: exception.message,
        ephemeral: true,
      });
    }

    return console.log(exception);
  }
}
