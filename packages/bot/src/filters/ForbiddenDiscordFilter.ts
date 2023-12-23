import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ForbiddenException,
} from '@nestjs/common';
import { NecordArgumentsHost } from 'necord';
import { EmbedBuilder, InteractionType } from 'discord.js';

@Catch(ForbiddenException)
export class ForbiddenDiscordFilter implements ExceptionFilter {
  public async catch(exception: ForbiddenException, host: ArgumentsHost) {
    const necordArguments =
      NecordArgumentsHost.create(host).getContext<'interactionCreate'>();

    if (!Array.isArray(necordArguments)) throw exception;

    const [interaction] = necordArguments;

    if (!interaction) return;

    const errorEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle("You don't have permission to do that.");

    if (interaction.type === InteractionType.ApplicationCommand) {
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
    }
  }
}
