import {
  Profile,
  Strategy,
  StrategyOptionsWithRequest,
} from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@auth/auth.service.js';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private authService: AuthService, config: ConfigService) {
    const options: StrategyOptionsWithRequest = {
      passReqToCallback: true,
      clientID: config.get('DISCORD_CLIENT_ID'),
      clientSecret: config.get('DISCORD_SECRET'),
      callbackURL: config.get('DISCORD_CALLBACK'),
      scope: ['identify', 'guilds', 'guilds.members.read'],
    };
    super(options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const user = await this.authService.validateDiscordUser(
      accessToken,
      profile,
    );

    if (!user) {
      throw new UnauthorizedException(user);
    }
    return user;
  }
}
