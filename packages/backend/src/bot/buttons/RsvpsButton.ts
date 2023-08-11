import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GuildMember } from 'discord.js';
import { Button, Context, ButtonContext, ComponentParam } from 'necord';
import { DelayModalBuilder } from '../modals/Delay.modal';
import rsvpReminderMessage from '../utils/rsvpReminderMessage';
import { v4 as uuid } from 'uuid';
import {
  DRIZZLE_TOKEN,
  type RSVPStatus,
  type DrizzleDatabase,
} from '@/drizzle/drizzle.module';
import { rsvp, user } from '../../drizzle/schema';
import { ROLES } from '@/constants';

@Injectable()
export class RsvpsButton {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
  ) {}

  @Button('event/:eventId/rsvp/:rsvpStatus')
  public async onRsvpButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
    @ComponentParam('rsvpStatus') rsvpStatus: RSVPStatus,
  ) {
    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });

    if (!fetchedEvent)
      return interaction.reply({
        ephemeral: true,
        content: "This meeting doesn't exist.",
      });

    const userId = interaction.user.id;

    const interactionUser = interaction.member;

    if (!(interactionUser instanceof GuildMember)) {
      return interaction.reply('Not a guild member');
    }

    const userRoles = [
      ...interactionUser.roles.cache.mapValues((role) => role.id).values(),
    ];

    const username = interactionUser.nickname
      ? (await interactionUser.fetch()).nickname
      : interactionUser.user.username;

    await this.db
      .insert(user)
      .values({
        id: userId,
        username,
        roles: userRoles,
      })
      .onConflictDoUpdate({
        target: user.id,
        set: {
          username,
          roles: userRoles,
        },
      });

    if (fetchedEvent.type === 'Mentor') {
      if (!userRoles.includes(ROLES.MENTOR))
        return interaction.reply({
          ephemeral: true,
          content: "You're not a mentor.",
        });
    }

    await this.db
      .insert(rsvp)
      .values({
        id: uuid(),
        eventId,
        userId,
        status: rsvpStatus,
      })
      .onConflictDoUpdate({
        target: [rsvp.eventId, rsvp.userId],
        set: {
          status: rsvpStatus,
        },
      });

    const newRSVPs = await this.db.query.rsvp.findMany({
      where: (rsvp, { eq }) => eq(rsvp.eventId, eventId),
      orderBy: (rsvp) => [rsvp.status, rsvp.updatedAt],
      with: {
        user: {
          columns: {
            username: true,
            roles: true,
          },
        },
      },
    });

    const eventDB = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });

    const frontendUrl = this.config.getOrThrow('FRONTEND_URL');

    if (rsvpStatus === 'LATE') {
      // return interaction.deferUpdate();
      return interaction.showModal(DelayModalBuilder(eventDB.id));
    } else {
      return interaction.update({
        ...rsvpReminderMessage(eventDB, newRSVPs, frontendUrl),
      });
    }
  }
}
