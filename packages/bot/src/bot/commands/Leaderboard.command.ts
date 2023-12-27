import { Inject, Injectable, UseGuards, UseInterceptors } from '@nestjs/common';
import { SlashCommand, Context, type SlashCommandContext } from 'necord';

import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import { DateTime, Duration } from 'luxon';
import { LeaderBoardUser } from 'backend/schema';
import { z } from 'zod';
import { BACKEND_TOKEN, type BackendClient } from '@/backend/backend.module';
import { GuildMemberGuard } from '../guards/GuildMemberGuard';

const roundDuration = (duration: Duration) => {
  const millis = duration.toMillis();
  // round to the nearest minute
  const rounded = Math.round(millis / 60000) * 60000;
  const hours = Math.floor(rounded / 3600000);
  const minutes = Math.floor((rounded % 3600000) / 60000);
  return Duration.fromObject({ hours, minutes });
};

const leaderboardLine = (data: z.infer<typeof LeaderBoardUser>) =>
  `${data.rank}. **${data.username}** - ${roundDuration(
    Duration.fromISO(data.duration),
  ).toHuman()}`;

const guildId = process.env['GUILD_ID'];

function splitMessage(message: string): string[] {
  const maxChars = 2000;
  let currentIndex = 0; // The current character index being checked
  let lastSplitIndex = 0; // The last index the string was split at
  let mostRecentNewLineIndex = 0; // The last index a newline was encountered

  const chunks = [];

  while (currentIndex < message.length) {
    if (message[currentIndex] === '\n') {
      mostRecentNewLineIndex = currentIndex;
    }

    if (currentIndex - lastSplitIndex >= maxChars) {
      if (mostRecentNewLineIndex > lastSplitIndex) {
        chunks.push(message.slice(lastSplitIndex, mostRecentNewLineIndex));
        lastSplitIndex = mostRecentNewLineIndex + 1;
      } else {
        chunks.push(message.slice(lastSplitIndex, currentIndex));
        lastSplitIndex = currentIndex;
      }
    }

    currentIndex++;
  }

  return chunks;
}

@Injectable()
export class LeaderBoardCommand {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {}

  @UseGuards(GuildMemberGuard)
  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'leaderboard',
    description: 'Get the leaderboard for outreach hours',
    guilds: guildId ? [guildId] : undefined,
    dmPermission: false,
  })
  public async onLeaderboard(@Context() [interaction]: SlashCommandContext) {
    const currentLeaderboard =
      await this.backendClient.client.bot.leaderboard.query();

    const headerLine = `# Outreach Leaderboard`;

    const contentLines = currentLeaderboard.map(leaderboardLine).join('\n');

    const footerLine = `### Generated by ${interaction.user.toString()} at ${DateTime.local().toLocaleString(
      DateTime.DATETIME_MED,
    )}`;

    const joined = [headerLine, contentLines, footerLine].join('\n');

    const split = splitMessage(joined);

    if (split.length > 1) {
      await interaction.reply(split[0]);
      for (const message of split.slice(1)) {
        await interaction.followUp(message);
      }
    } else {
      await interaction.reply(joined);
    }
  }
}
