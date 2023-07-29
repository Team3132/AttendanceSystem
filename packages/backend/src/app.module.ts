import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/role.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScancodeModule } from './scancode/scancode.module';
import { AuthenticatorModule } from './authenticator/authenticator.module';
import { GatewayIntentBits } from 'discord.js';
import { BotModule } from './bot/bot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { GcalModule } from './gcal/gcal.module';
import { NecordModule } from 'necord';
import { BotService } from './bot/bot.service';
import { redisStore } from 'cache-manager-ioredis-yet';
import { TbaModule } from './tba/tba.module';
import { CacheModule } from '@nestjs/cache-manager';
import { OutreachModule } from './outreach/outreach.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    DrizzleModule,
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
    PrismaModule,
    UserModule,
    EventModule,
    RsvpModule,
    ScancodeModule,
    AuthenticatorModule,
    BotModule,
    TaskModule,
    GcalModule,
    TbaModule,
    OutreachModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BotService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
