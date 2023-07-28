import { PrismaService } from '@/prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbedBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import { Button, Context, ButtonContext, ComponentParam } from 'necord';
import rsvpToDescription from '../utils/rsvpToDescription';
import { DRIZZLE_TOKEN, DrizzleDatabase } from '@/drizzle/drizzle.module';
import { event, rsvp, user } from '../../../drizzle/schema';
import { asc, eq } from 'drizzle-orm';

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
    const rsvpEvents = await this.db
      .select()
      .from(event)
      .where(eq(event.id, eventId));

    const rsvpEvent = rsvpEvents[0];

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

    const eventRsvps = await this.db
      .select()
      .from(rsvp)
      .where(eq(rsvp.eventId, eventId))
      .leftJoin(user, eq(rsvp.userId, user.id))
      .orderBy(asc(rsvp.createdAt));

    if (!eventRsvps.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

    const firstIdRsvp = eventRsvps[0].RSVP.id;

    const description = eventRsvps
      .map(({ RSVP, User }) =>
        rsvpToDescription(RSVP, User, firstIdRsvp === RSVP.id),
      )
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
