import { PrismaService } from '@/prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RSVPStatus } from '@prisma/client';
import { GuildMember } from 'discord.js';
import { Button, Context, ButtonContext, ComponentParam } from 'necord';
import { DelayModalBuilder } from '../modals/Delay.modal';
import connectOrCreateGuildMember from '../utils/connectOrCreateGuildMember';
import rsvpReminderMessage from '../utils/rsvpReminderMessage';
import { DRIZZLE_TOKEN, DrizzleDatabase } from '@/drizzle/drizzle.module';
import { rsvp, user } from '../../../drizzle/schema';

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

    const roles = fetchedEvent.roles.length
      ? fetchedEvent.roles
      : [interaction.guild.roles.everyone.id];

    await this.db
      .insert(user)
      .values({
        id: userId,
        username: interactionUser.nickname ?? interactionUser.user.username,
        roles: [
          ...interactionUser.roles.cache.mapValues((role) => role.id).values(),
        ],
      })
      .onConflictDoUpdate({
        target: user.id,
        set: {
          username: interactionUser.nickname ?? interactionUser.user.username,
          roles: [
            ...interactionUser.roles.cache
              .mapValues((role) => role.id)
              .values(),
          ],
        },
      });

    // await this.db.user.upsert({
    //   ...connectedOrCreatedGuildMember,
    //   update: {
    //     username: connectedOrCreatedGuildMember.create.username,
    //     roles: connectedOrCreatedGuildMember.create.roles,
    //   },
    // });

    if (!interactionUser.roles.cache.some((role) => roles.includes(role.id)))
      return interaction.reply({
        ephemeral: true,
        content: "You don't have permission to reply to this event",
      });

    const newRSVP = await this.db
      .insert(rsvp)
      .values({
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

    if (rsvpStatus === RSVPStatus.LATE) {
      // return interaction.deferUpdate();
      return interaction.showModal(DelayModalBuilder(eventDB.id));
    } else {
      return interaction.update({
        ...rsvpReminderMessage(
          eventDB,
          newRSVPs,
          frontendUrl,
          interaction.guild.roles.everyone.id,
        ),
      });
    }
  }
}
