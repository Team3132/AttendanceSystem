import { GuildMember } from 'discord.js';

export default function connectOrCreateGuildMember(guildMember: GuildMember) {
  return {
    where: { id: guildMember.id },
    create: {
      id: guildMember.id,
      username: guildMember.nickname ?? guildMember.user.username,
      roles: [...guildMember.roles.cache.mapValues((role) => role.id).values()],
    },
  };
}
