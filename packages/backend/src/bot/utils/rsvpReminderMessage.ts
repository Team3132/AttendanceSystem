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
  const clonedRsvp = [...rsvp];

  const sortedByCreated = clonedRsvp.sort(
    (rsvpA, rsvpB) => rsvpB.createdAt.getTime() - rsvpA.createdAt.getTime(),
  );

  const firstId = sortedByCreated.at(-1)?.id;

  const description = rsvp
    .map((rawRsvp) => rsvpToDescription(rawRsvp, rawRsvp.id === firstId))
    .join('\n');

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
      .setStyle(ButtonStyle.Success)
      .setLabel('Coming'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.MAYBE}`)
      .setStyle(ButtonStyle.Secondary)
      .setLabel('Maybe'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.NO}`)
      .setStyle(ButtonStyle.Danger)
      .setLabel('Not Coming'),
    //   .setEmoji('❌'),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${RSVPStatus.LATE}`)
      .setStyle(ButtonStyle.Primary)
      .setLabel('Late'),
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
