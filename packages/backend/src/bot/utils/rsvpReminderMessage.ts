import { Event, RSVP, RSVPStatus } from '@prisma/client';
import {
  ActionRowBuilder,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  roleMention,
  time,
} from 'discord.js';
import rsvpToDescription from './rsvpToDescription';

export default function rsvpReminderMessage(
  event: Event,
  rsvp: (RSVP & {
    user: {
      username?: string;
    };
  })[],
  frontendUrl: string,
  everyoneRole: string,
): BaseMessageOptions {
  const description = rsvp.map(rsvpToDescription).join('\n');

  const meetingEmbed = new EmbedBuilder({
    description: description ?? undefined,
  })
    .setTitle(event.title)
    .addFields(
      {
        name: 'Roles',
        value: event.roles.length
          ? event.roles.map((role) => roleMention(role)).join()
          : roleMention(everyoneRole),
      },
      { name: 'All Day', value: event.allDay ? 'Yes' : 'No' },
      { name: 'Start Time', value: time(event.startDate) },
      { name: 'End Time', value: time(event.endDate) },
    )
    .setURL(`${frontendUrl}/event/${event.id}`);

  const messageComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.YES}`)
      .setStyle(ButtonStyle.Primary)
      .setLabel('Coming')
      .setEmoji('✅'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.MAYBE}`)
      .setStyle(ButtonStyle.Primary)
      .setLabel('Maybe')
      .setEmoji('❔'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.NO}`)
      .setStyle(ButtonStyle.Primary)
      .setLabel('Not Coming')
      .setEmoji('❌'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.LATE}`)
      .setStyle(ButtonStyle.Primary)
      .setLabel('Late')
      .setEmoji('🕒'),
    // new ButtonBuilder()
    //   .setCustomId(`event/${event.id}/rsvps`)
    //   .setStyle(ButtonStyle.Primary)
    //   .setLabel('RSVPs'),
  );

  return {
    embeds: [meetingEmbed],
    components: [messageComponent],
  };
}
