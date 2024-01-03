import { GuildMember } from 'discord.js';
import { MemberOption, NumberOption, StringOption } from 'necord';

export class AddBuildPointsOptionsDto {
  @MemberOption({
    name: 'user',
    description: 'The user to add points to',
    required: true,
  })
  user: GuildMember;
  @NumberOption({
    name: 'points',
    description: 'The number of points to add',
    required: true,
    min_value: 1,
    max_value: 1,
  })
  points: number;

  @StringOption({
    name: 'reason',
    description: 'The reason for adding points',
    required: false,
  })
  reason?: string;
}
