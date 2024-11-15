import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { ScheduleModule } from "@nestjs/schedule";
import { GatewayIntentBits } from "discord.js";
import { NecordModule } from "necord";
import { AppService } from "./app.service";
import { BackendModule } from "./backend/backend.module";
import { BotModule } from "./bot/bot.module";
import { BotService } from "./bot/bot.service";
import { TaskModule } from "./task/task.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    BackendModule,
    NecordModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.getOrThrow("VITE_DISCORD_TOKEN"),
        intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
        development: configService.getOrThrow("VITE_GUILD_ID"),
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
