import { Inject, Injectable, Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GuildMember } from 'discord.js';
import { Button, Context, type ButtonContext, ComponentParam } from 'necord';
import rsvpReminderMessage from '../utils/rsvpReminderMessage';
import { ROLES } from '@/constants';
import { DelayModal } from '../modals/Delay.modal';
import { BACKEND_TOKEN, type BackendClient } from '@/backend/backend.module';
import { z } from 'zod';
import { RSVPStatusSchema } from '@team3132/attendance-backend/schema';
import { GuildMemberGuard } from '../guards/GuildMemberGuard';

@Injectable()
export class RsvpsButton {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(RsvpsButton.name);

  @UseGuards(GuildMemberGuard)
  @Button('event/:eventId/rsvp/:rsvpStatus')
  public async onRsvpButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
    @ComponentParam('rsvpStatus') rsvpStatus: z.infer<typeof RSVPStatusSchema>,
  ) {
    const fetchedEvent =
      await this.backendClient.client.bot.getEventDetails.query(eventId);

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

    const fetchedUser = await interactionUser.fetch();

    const username = fetchedUser.nickname ?? fetchedUser.user.username;

    await this.backendClient.client.bot.findOrCreateUser.mutate({
      id: userId,
      username,
      roles: userRoles,
    });

    // const fetchedUser = fetchedUsers.at(0);

    if (fetchedEvent.type === 'Mentor' && !userRoles.includes(ROLES.MENTOR)) {
      return interaction.reply({
        ephemeral: true,
        content: "You're not a mentor.",
      });
    }

    await this.backendClient.client.bot.setEventRsvp.mutate({
      eventId,
      userId,
      status: rsvpStatus,
    });

    this.logger.debug(`${username} RSVP'd ${rsvpStatus} to ${eventId}`);

    const newRSVPs =
      await this.backendClient.client.bot.getEventRsvps.query(eventId);

    const frontendUrl = this.config.getOrThrow('FRONTEND_URL');

    if (rsvpStatus === 'LATE') {
      // return interaction.deferUpdate();
      return interaction.showModal(DelayModal.build(eventId));
    } else {
      return interaction.update({
        ...rsvpReminderMessage(fetchedEvent, newRSVPs, frontendUrl),
      });
    }
  }
}
