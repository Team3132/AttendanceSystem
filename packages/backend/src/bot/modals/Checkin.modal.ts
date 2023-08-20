import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GuildMember, TextInputStyle } from 'discord.js';
import { Ctx, Modal, ModalContext, ModalParam } from 'necord';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { event, rsvp, user } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CheckoutActiveData } from '@/event/types/CheckoutActive';

@Injectable()
export class CheckinModal {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
    @InjectQueue('event')
    private readonly eventQueue: Queue<CheckoutActiveData>,
  ) {}

  private readonly logger = new Logger(CheckinModal.name);

  @Modal(`event/:eventId/checkin`)
  public async onCheckinModal(
    @Ctx() [interaction]: ModalContext,
    @ModalParam('eventId') eventId: string,
  ) {
    const code = interaction.fields.getTextInputValue('code');

    const userId = interaction.user.id;

    const fetchedEvent = await this.db.query.event.findFirst({
      where: eq(event.id, eventId),
    });

    if (!fetchedEvent) {
      return interaction.reply({
        ephemeral: true,
        content: "This meeting doesn't exist.",
      });
    }

    if (fetchedEvent.secret !== code) {
      return interaction.reply({
        ephemeral: true,
        content: 'Invalid code.',
      });
    }

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

    const fetchedUsers = await this.db
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
      })
      .returning();

    const fetchedUser = fetchedUsers.at(0);

    const currentDate = new Date();

    const eventStartTime = new Date(fetchedEvent.startDate).getTime();

    const checkinTime =
      currentDate.getTime() <= eventStartTime
        ? fetchedEvent.startDate
        : currentDate.toISOString();

    const eventEndTime = new Date(fetchedEvent.endDate).getTime();

    const timeDiff = eventEndTime - currentDate.getTime();

    const delay = timeDiff > 0 ? timeDiff : 0;

    const existingRsvp = await this.db.query.rsvp.findFirst({
      where: (rsvp, { and, eq }) =>
        and(eq(rsvp.eventId, fetchedEvent.id), eq(rsvp.userId, fetchedUser.id)),
    });

    if (!existingRsvp) {
      const newRsvp = await this.db
        .insert(rsvp)
        .values({
          id: uuid(),
          userId: fetchedUser.id,
          eventId: fetchedEvent.id,
          checkinTime,
        })
        .returning();

      const firstNewRsvp = newRsvp.at(0);

      if (!firstNewRsvp) {
        return interaction.reply({
          ephemeral: true,
          content: 'Something went wrong',
        });
      }

      await this.eventQueue.add(
        'checkoutActive',
        {
          eventId: fetchedEvent.id,
          rsvpId: firstNewRsvp.id,
        },
        {
          delay,
          jobId: firstNewRsvp.id,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );

      this.logger.debug(
        `Created new RSVP for ${fetchedUser.username} for ${fetchedEvent.title}`,
      );

      return interaction.reply({
        ephemeral: true,
        content: 'You have checked in',
      });
    }

    if (existingRsvp.checkinTime !== null) {
      return interaction.reply({
        ephemeral: true,
        content: 'You have already checked in',
      });
    }

    const upsertedRsvp = await this.db
      .insert(rsvp)
      .values({
        id: uuid(),
        eventId: fetchedEvent.id,
        userId: fetchedUser.id,
        checkinTime,
      })
      .onConflictDoUpdate({
        target: [rsvp.eventId, rsvp.userId],
        set: {
          checkinTime,
        },
      })
      .returning();

    const firstResult = upsertedRsvp.at(0);

    if (firstResult) {
      await this.eventQueue.add(
        'checkoutActive',
        {
          eventId: fetchedEvent.id,
          rsvpId: firstResult.id,
        },
        {
          delay,
          jobId: firstResult.id,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }

    this.logger.debug(
      `Updated RSVP for ${fetchedUser.username} for ${fetchedEvent.title}`,
    );

    return interaction.reply({
      ephemeral: true,
      content: 'You have checked in',
    });
  }

  /**
   * Builds a checkin modal
   * @param eventId The event ID to checkin for
   * @returns A modal builder for the checkin modal
   */
  public static build(eventId: string) {
    return new ModalBuilder()
      .setTitle('Checkin')
      .setCustomId(`event/${eventId}/checkin`)
      .setComponents([
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
          new TextInputBuilder()
            .setCustomId('code')
            .setPlaceholder('8 digit code')
            .setRequired(true)
            .setMinLength(8)
            .setMaxLength(8)
            .setLabel('The event code')
            .setStyle(TextInputStyle.Short),
        ]),
      ]);
  }
}
