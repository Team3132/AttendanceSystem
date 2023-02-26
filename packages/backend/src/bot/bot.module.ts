import { AuthenticatorModule } from '@/authenticator/authenticator.module';
import { AuthenticatorService } from '@/authenticator/authenticator.service';
import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  controllers: [BotController],
  imports: [AuthenticatorModule],
  providers: [BotService, AuthenticatorService],
  exports: [BotService],
})
export class BotModule {}
