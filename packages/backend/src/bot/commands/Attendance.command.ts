import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbedBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import { SlashCommandContext, Options, Context, SlashCommand } from 'necord';
import { AttendanceDto } from '../dto/attendance.dto';
import { EventAutocompleteInterceptor } from '../interceptors/event.interceptor';
import attendanceToDescription from '../utils/attendanceToDescription';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { and, eq, sql } from 'drizzle-orm';
import { rsvp, user } from '../../../drizzle/schema';

@Injectable()
export class AttendanceCommand {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
  ) {}

  @UseInterceptors(EventAutocompleteInterceptor)
  @SlashCommand({
    name: 'attendance',
    description: 'Get the attendance for a meeting.',
    guilds: [process.env['GUILD_ID']],
  })
  public async onAttendance(
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
        attended: rsvp.attended,
        userId: rsvp.userId,
        user: {
          username: user.username,
        },
      })
      .from(rsvp)
      .leftJoin(user, eq(rsvp.userId, user.id))
      .where(
        and(eq(rsvp.eventId, meeting), sql`${role.id} = ANY(${user.roles})`),
      );

    if (!fetchedRSVPs.length)
      return interaction.reply({ content: 'No responses', ephemeral: true });

    const description = fetchedRSVPs.map(attendanceToDescription).join(`\n`);

    const attendanceEmbed = new EmbedBuilder()
      .setTitle(
        `Attendance for ${fetchedMeeting.title} at ${DateTime.fromISO(
          fetchedMeeting.startDate,
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get('FRONTEND_URL')}/event/${fetchedMeeting.id}`);

    return interaction.reply({
      embeds: [attendanceEmbed],
    });
  }
}
