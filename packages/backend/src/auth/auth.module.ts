import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { DiscordStrategy } from './strategy/discord.strategy';
import { BotModule } from '@/bot/bot.module';
import { BotService } from '@/bot/bot.service';
import { AuthenticatorModule } from '@/authenticator/authenticator.module';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    BotModule,
    AuthenticatorModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, DiscordStrategy, SessionSerializer, BotService],
  exports: [AuthService],
})
export class AuthModule {}
