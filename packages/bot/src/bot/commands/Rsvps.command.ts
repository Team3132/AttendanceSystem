import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbedBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import {
  SlashCommand,
  Context,
  type SlashCommandContext,
  Options,
} from 'necord';
import { AttendanceDto } from '../dto/attendance.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import rsvpToDescription from '../utils/rsvpToDescription';
import { BACKEND_TOKEN, type BackendClient } from '@/backend/backend.module';

const guildId = process.env['GUILD_ID'];

@Injectable()
export class RsvpsCommand {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
    private readonly config: ConfigService,
  ) {}

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'rsvps',
    description: 'Get the rsvps for a meeting.',
    guilds: guildId ? [guildId] : undefined,
  })
  public async onRSVPs(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting }: AttendanceDto,
  ) {
    const fetchedMeeting =
      await this.backendClient.client.bot.getEventDetails.query(meeting);

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    const fetchedRSVPs =
      await this.backendClient.client.bot.getEventRsvps.query(meeting);

    if (!fetchedRSVPs.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

    const firstId = fetchedRSVPs.at(0)?.id;

    const description = fetchedRSVPs
      .map((rsvp) => rsvpToDescription(rsvp, rsvp.id === firstId))
      .join(`\n`);

    const rsvpEmbed = new EmbedBuilder()
      .setTitle(
        `RSVPs for ${fetchedMeeting.title} at ${DateTime.fromISO(
          fetchedMeeting.startDate,
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get('FRONTEND_URL')}/events/${fetchedMeeting.id}`);

    return interaction.reply({
      embeds: [rsvpEmbed],
    });
  }
}
