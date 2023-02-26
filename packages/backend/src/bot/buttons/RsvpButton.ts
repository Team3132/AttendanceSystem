import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbedBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import { Button, Context, ButtonContext, ComponentParam } from 'necord';
import rsvpToDescription from '../utils/rsvpToDescription';

@Injectable()
export class RsvpButton {
  constructor(
    private readonly db: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Button('event/:eventId/rsvps')
  public async onRsvpsButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
  ) {
    const fetchedMeeting = await this.db.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        RSVP: {
          orderBy: {
            updatedAt: 'asc',
          },
          where: {
            status: {
              not: null,
            },
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!fetchedMeeting)
      return interaction.reply({ content: 'Unknown event', ephemeral: true });

    if (!fetchedMeeting.RSVP.length)
      return interaction.reply({ content: 'No RSVPs', ephemeral: true });

    const description = fetchedMeeting.RSVP.map(rsvpToDescription).join(`\n`);

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
      ephemeral: true,
      embeds: [rsvpEmbed],
    });
  }
}
