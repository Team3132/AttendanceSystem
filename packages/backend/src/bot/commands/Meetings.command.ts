import {
  DRIZZLE_TOKEN,
  type DrizzleDatabase,
  Event,
} from '@/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbedBuilder } from 'discord.js';
import { asc, gte } from 'drizzle-orm';
import { DateTime } from 'luxon';
import { SlashCommand, Context, SlashCommandContext } from 'necord';

@Injectable()
export class MeetingsCommand {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
  ) {}

  @SlashCommand({
    name: 'meetings',
    description: 'Get the next few meetings',
    guilds: [process.env['GUILD_ID']],
  })
  public async onMeetings(@Context() [interaction]: SlashCommandContext) {
    // const nextFive = await this.db.event.findMany({
    //   where: {
    //     startDate: {
    //       gte: new Date(),
    //     },
    //     endDate: {
    //       gte: new Date(),
    //     },
    //   },
    //   orderBy: {
    //     startDate: 'asc',
    //   },
    //   take: 5,
    // });

    const nextFive = await this.db.query.event.findMany({
      where: (event) => gte(event.startDate, DateTime.local().toISO()),
      orderBy: (event) => asc(event.startDate),
      limit: 5,
    });

    const eventEmbed = (event: Event) =>
      new EmbedBuilder({
        description: event.description,
        title: event.title,
        timestamp: event.startDate,
        url: `${this.config.get('FRONTEND_URL')}/event/${event.id}`,
      });

    const embededEvents = nextFive.map(eventEmbed);

    const noEventEmbed = new EmbedBuilder()
      .setTitle('No upcoming events')
      .setDescription('No upcoming events were found to display.');

    return interaction.reply({
      content: embededEvents
        ? 'Here are the upcoming events'
        : 'No upcoming events',
      embeds: embededEvents ?? [noEventEmbed],
    });
  }
}
