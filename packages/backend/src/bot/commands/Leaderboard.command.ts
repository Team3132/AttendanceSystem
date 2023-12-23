import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { SlashCommand, Context, type SlashCommandContext } from 'necord';

import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import { DateTime, Duration } from 'luxon';
import { LeaderBoardUser } from 'newbackend/schema';
import { z } from 'zod';
import { BACKEND_TOKEN, type BackendClient } from '@/backend/backend.module';

const leaderboardLine = (data: z.infer<typeof LeaderBoardUser>) =>
  `${data.rank}. **${data.username}** - ${Duration.fromISO(
    data.duration,
  ).toHuman()}`;

const guildId = process.env['GUILD_ID'];

@Injectable()
export class LeaderBoardCommand {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {}

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'leaderboard',
    description: 'Get the leaderboard for outreach hours',
    guilds: guildId ? [guildId] : undefined,
  })
  public async onLeaderboard(@Context() [interaction]: SlashCommandContext) {
    console.log(this.backendClient);
    const currentLeaderboard =
      await this.backendClient.client.bot.leaderboard.query();

    const headerLine = `# Outreach Leaderboard`;

    const contentLines = currentLeaderboard.map(leaderboardLine).join('\n');

    const footerLine = `### Generated by ${interaction.user.toString()} at ${DateTime.local().toLocaleString(
      DateTime.DATETIME_MED,
    )}`;

    const joined = [headerLine, contentLines, footerLine].join('\n');

    return interaction.reply({
      content: joined,
    });
  }
}
