import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbedBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { AttendanceDto } from '../dto/attendance.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import rsvpToDescription from '../utils/rsvpToDescription';
import { DRIZZLE_TOKEN, DrizzleDatabase } from '@/drizzle/drizzle.module';
import { rsvp, user } from '../../../drizzle/schema';
import { and, eq, isNotNull } from 'drizzle-orm';

@Injectable()
export class RsvpsCommand {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
  ) {}

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'rsvps',
    description: 'Get the rsvps for a meeting.',
    guilds: [process.env['GUILD_ID']],
  })
  public async onRSVPs(
    @Context() [interaction]: SlashCommandContext,
    @Options() { meeting, role }: AttendanceDto,
  ) {
    const fetchedMeeting = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, meeting),
    });

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    // const fetchedRSVPs = await this.db.rSVP.findMany({
    //   where: {
    //     eventId: meeting,
    //     user: {
    //       roles: {
    //         has: role?.id,
    //       },
    //     },
    //     status: {
    //       not: null,
    //     },
    //   },
    //   include: {
    //     user: {
    //       select: {
    //         username: true,
    //       },
    //     },
    //   },
    // });

    const fetchedRSVPs = await this.db
      .select({
        id: rsvp.id,
        status: rsvp.status,
        delay: rsvp.delay,
        userId: rsvp.userId,
        user: {
          username: user.username,
        },
      })
      .from(rsvp)
      .leftJoin(user, eq(rsvp.userId, user.id))
      .where(and(eq(rsvp.eventId, meeting), isNotNull(rsvp.status)))
      .orderBy(rsvp.status, rsvp.createdAt);

    if (!fetchedRSVPs.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

    const firstId = fetchedRSVPs.at(0).id;

    const description = fetchedRSVPs
      .map((rsvp) => rsvpToDescription(rsvp, rsvp.id === firstId))
      .join(`\n`);

    const rsvpEmbed = new EmbedBuilder()
      .setTitle(
        `RSVPs for ${fetchedMeeting.title} at ${DateTime.fromJSDate(
          fetchedMeeting.startDate,
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get('FRONTEND_URL')}/event/${fetchedMeeting.id}`);

    return interaction.reply({
      embeds: [rsvpEmbed],
    });
  }
}
