import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { GatewayIntentBits } from 'discord.js';
import { BotModule } from './bot/bot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { NecordModule } from 'necord';
import { BotService } from './bot/bot.service';
import { BackendModule } from './backend/backend.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    BackendModule,
    NecordModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.getOrThrow('DISCORD_TOKEN'),
        intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
        development: configService.getOrThrow('GUILD_ID'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    BotModule,
    TaskModule,
  ],
  controllers: [],
  providers: [AppService, BotService],
})
export class AppModule {}
