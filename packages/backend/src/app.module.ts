import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayIntentBits } from 'discord.js';
import { BotModule } from './bot/bot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { NecordModule } from 'necord';
import { BotService } from './bot/bot.service';
import { redisStore } from 'cache-manager-ioredis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../frontend'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({ isGlobal: true, cache: true }),

    NecordModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.getOrThrow('DISCORD_TOKEN'),
        intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
        development: configService.getOrThrow('GUILD_ID'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          ttl: 60 * 60 * 24 * 7 * 1000,
          host: config.getOrThrow('REDIS_HOST'),
          port: config.getOrThrow('REDIS_PORT'),
          db: 1,
        });

        return {
          store,
        };
      },
      inject: [ConfigService],
    }),
    BotModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService, BotService],
})
export class AppModule {}
