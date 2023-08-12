import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '@auth/auth.module';
import { AuthService } from '@auth/auth.service';
import { ScancodeModule } from '@scancode/scancode.module';
import { ScancodeService } from '@scancode/scancode.service';
import { BotModule } from '@/bot/bot.module';
import { BotService } from '@/bot/bot.service';

@Module({
  imports: [AuthModule, ScancodeModule, BotModule],
  controllers: [UserController],
  providers: [UserService, AuthService, ScancodeService, BotService],
})
export class UserModule {}
