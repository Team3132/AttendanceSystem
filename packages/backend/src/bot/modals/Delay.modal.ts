import { PrismaService } from '@/prisma/prisma.service';
import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TextInputStyle } from 'discord.js';
import { Ctx, Modal, ModalContext, ModalParam } from 'necord';
import { z, ZodError } from 'zod';
import rsvpReminderMessage from '../utils/rsvpReminderMessage';

@Injectable()
export class DelayModal {
  constructor(
    private readonly db: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Modal(`event/:eventId/delay`)
  public async onDelayModal(
    @Ctx() [interaction]: ModalContext,
    @ModalParam('eventId') eventId: string,
  ) {
    const delay = interaction.fields.getTextInputValue('delay');

    const value = z.string().regex(/^\d+$/).transform(Number).parseAsync(delay);

    const userId = interaction.user.id;

    try {
      const delay = await value;

      this.db.rSVP
        .update({
          where: {
            eventId_userId: {
              eventId,
              userId,
            },
          },
          data: {
            delay,
          },
          include: {
            event: {
              include: {
                RSVP: {
                  orderBy: {
                    updatedAt: 'asc',
                  },
                  include: {
                    user: {
                      select: {
                        username: true,
                        roles: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
        .then((res) => {
          const event = res.event;
          const rsvps = event.RSVP;
          const frontendUrl = this.config.getOrThrow('FRONTEND_URL');

          if (interaction.isFromMessage()) {
            return interaction.update({
              ...rsvpReminderMessage(
                event,
                rsvps,
                frontendUrl,
                interaction.guild.roles.everyone.id,
              ),
            });
          } else {
            return interaction.reply({
              ephemeral: true,
              ...rsvpReminderMessage(
                event,
                rsvps,
                frontendUrl,
                interaction.guild.roles.everyone.id,
              ),
            });
          }
        })

        .catch(() => {
          return interaction.reply({
            content: 'Error setting delay',
            ephemeral: true,
          });
        });
    } catch (err) {
      const error = err as ZodError;
      return interaction.reply({
        content: 'Please enter a valid number (no decimals)',
        ephemeral: true,
      });
    }
  }
}

export const DelayModalBuilder = (eventId: string) =>
  new ModalBuilder()
    .setTitle('Delay')
    .setCustomId(`event/${eventId}/delay`)
    .setComponents([
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
        new TextInputBuilder()
          .setCustomId('delay')
          .setPlaceholder('Delay')
          .setLabel('Delay (in minutes)')
          .setStyle(TextInputStyle.Short),
      ]),
    ]);
