import { Injectable, Logger } from '@nestjs/common';
import { Context, type ContextOf, On } from 'necord';
import { Client } from 'discord.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService {
  constructor(
    private readonly client: Client,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(BotService.name);

  async getGuild() {
    const guildId = this.config.getOrThrow<string>('GUILD_ID');
    const cachedGuild = this.client.guilds.cache.get(guildId);

    if (!cachedGuild || !cachedGuild.available) {
      return this.client.guilds.fetch(guildId);
    } else {
      return cachedGuild;
    }
  }

  async getRoles() {
    const guild = await this.getGuild();
    return guild.roles.cache.size ? guild.roles.cache : guild.roles.fetch();
  }

  async getGuildMember(userId: string) {
    const guild = await this.getGuild();
    const guildMember =
      guild.members.cache.get(userId) ?? guild.members.fetch(userId);

    return guildMember;
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @On('error')
  public onError(@Context() [message]: ContextOf<'error'>) {
    this.logger.error(message);
  }
}
