import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbedBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import { Button, Context, ButtonContext, ComponentParam } from 'necord';
import rsvpToDescription from '../utils/rsvpToDescription';
import { DRIZZLE_TOKEN, DrizzleDatabase } from '@/drizzle/drizzle.module';
import { and, asc, eq, ne } from 'drizzle-orm';

@Injectable()
export class RsvpButton {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
  ) {}

  @Button('event/:eventId/rsvps')
  public async onRsvpsButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
  ) {
    const rsvpEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });

    // const fetchedMeeting = await this.db.event.findUnique({
    //   where: {
    //     id: eventId,
    //   },
    //   include: {
    //     RSVP: {
    //       orderBy: {
    //         updatedAt: 'asc',
    //       },
    //       where: {
    //         status: {
    //           not: null,
    //         },
    //       },
    //       include: {
    //         user: {
    //           select: {
    //             username: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    if (!rsvpEvent)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    const eventRsvps = await this.db.query.rsvp.findMany({
      where: (rsvp) => and(eq(rsvp.eventId, eventId), ne(rsvp.status, null)),
      orderBy: (rsvp) => [asc(rsvp.updatedAt)],
      with: {
        user: {
          columns: {
            username: true,
          },
        },
      },
    });

    if (!eventRsvps.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

    const firstIdRsvp = eventRsvps.at(0).id;

    const description = eventRsvps
      .map((rsvp) => rsvpToDescription(rsvp, firstIdRsvp === rsvp.id))
      .join(`\n`);

    const rsvpEmbed = new EmbedBuilder()
      .setTitle(
        `RSVPs for ${rsvpEvent.title} at ${DateTime.fromISO(
          rsvpEvent.startDate,
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}`,
      )
      .setDescription(description)
      .setTimestamp(new Date())
      .setURL(`${this.config.get('FRONTEND_URL')}/event/${rsvpEvent.id}`);

    return interaction.reply({
      ephemeral: true,
      embeds: [rsvpEmbed],
    });
  }
}
