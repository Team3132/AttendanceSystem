import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile as DiscordProfile } from 'passport-discord';
import { BotService } from '@/bot/bot.service';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { user } from '../drizzle/schema';
@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly configService: ConfigService,
    private readonly botService: BotService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateDiscordUser(access_token: string, discordUser: DiscordProfile) {
    const { guilds } = discordUser;
    if (
      !guilds
        .map((guild) => guild.id)
        .includes(this.configService.getOrThrow('GUILD_ID'))
    )
      throw new UnauthorizedException('You are not in the TDU Discord Server');

    this.logger.debug(
      `${discordUser.username}#${discordUser.discriminator} logged in!`,
    );
    const discordGuildMember = await this.botService.getGuildMember(
      discordUser.id,
    );

    const updatedUser = await this.db
      .insert(user)
      .values({
        id: discordGuildMember.id,
        username:
          discordGuildMember.nickname ?? discordGuildMember.user.username,
        roles: [
          ...discordGuildMember.roles.cache.mapValues((v) => v.id).values(),
        ],
      })
      .onConflictDoUpdate({
        target: user.id,
        set: {
          username:
            discordGuildMember.nickname ?? discordGuildMember.user.username,
          roles: [
            ...discordGuildMember.roles.cache.mapValues((v) => v.id).values(),
          ],
        },
      })
      .returning();

    return updatedUser;
  }
}
