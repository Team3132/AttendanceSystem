import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RSVPStatus } from '@prisma/client';
import { GuildMember } from 'discord.js';
import { Button, Context, ButtonContext, ComponentParam } from 'necord';
import { DelayModalBuilder } from '../modals/Delay.modal';
import connectOrCreateGuildMember from '../utils/connectOrCreateGuildMember';
import rsvpReminderMessage from '../utils/rsvpReminderMessage';

@Injectable()
export class RsvpsButton {
  constructor(
    private readonly db: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Button('event/:eventId/rsvp/:rsvpStatus')
  public async onRsvpButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
    @ComponentParam('rsvpStatus') rsvpStatus: RSVPStatus,
  ) {
    const fetchedEvent = await this.db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!fetchedEvent)
      return interaction.reply({
        ephemeral: true,
        content: "This meeting doesn't exist.",
      });

    const userId = interaction.user.id;

    const user = interaction.member;

    if (!(user instanceof GuildMember)) {
      return interaction.reply('Not a guild member');
    }

    const roles = fetchedEvent.roles.length
      ? fetchedEvent.roles
      : [interaction.guild.roles.everyone.id];

    if (!user.roles.cache.some((role) => roles.includes(role.id)))
      return interaction.reply({
        ephemeral: true,
        content: "You don't have permission to reply to this event",
      });

    const rsvp = await this.db.rSVP.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      create: {
        event: {
          connect: { id: eventId },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status: rsvpStatus,
      },
      update: {
        event: {
          connect: { id: eventId },
        },
        user: {
          connectOrCreate: connectOrCreateGuildMember(user),
        },
        status: rsvpStatus,
      },
      include: {
        event: {
          include: {
            RSVP: {
              include: {
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const event = rsvp.event;
    const rsvps = event.RSVP;
    const frontendUrl = this.config.getOrThrow('FRONTEND_URL');

    if (rsvpStatus === RSVPStatus.LATE) {
      // return interaction.deferUpdate();
      return interaction.showModal(DelayModalBuilder(event.id));
    } else {
      return interaction.update({
        ...rsvpReminderMessage(
          rsvp.event,
          rsvps,
          frontendUrl,
          interaction.guild.roles.everyone.id,
        ),
      });
    }
  }
}
