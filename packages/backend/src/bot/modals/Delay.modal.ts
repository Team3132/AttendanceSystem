import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TextInputStyle } from 'discord.js';
import { Ctx, Modal, ModalContext, ModalParam } from 'necord';
import { z } from 'zod';
import rsvpReminderMessage from '../utils/rsvpReminderMessage';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { rsvp } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class DelayModal {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
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

      await this.db
        .insert(rsvp)
        .values({
          id: uuid(),
          eventId,
          userId,
          delay,
        })
        .onConflictDoUpdate({
          target: [rsvp.eventId, rsvp.userId],
          set: {
            delay,
          },
        })
        .returning();

      const otherEventRsvps = await this.db.query.rsvp.findMany({
        where: (rsvp) => eq(rsvp.eventId, eventId),
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

      const relatedEvent = await this.db.query.event.findFirst({
        where: (event) => eq(event.id, eventId),
      });

      const frontendUrl = this.config.getOrThrow('FRONTEND_URL');

      if (interaction.isFromMessage()) {
        return interaction.update({
          ...rsvpReminderMessage(relatedEvent, otherEventRsvps, frontendUrl),
        });
      } else {
        return interaction.reply({
          ephemeral: true,
          ...rsvpReminderMessage(relatedEvent, otherEventRsvps, frontendUrl),
        });
      }
    } catch (err) {
      // const error = err as ZodError;
      return interaction.reply({
        content: 'Please enter a valid number (no decimals)',
        ephemeral: true,
      });
    }
  }

  public static build(eventId: string) {
    return new ModalBuilder()
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
  }
}
