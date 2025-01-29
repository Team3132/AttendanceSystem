import {
  ActionRowBuilder,
  type BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  roleMention,
  time,
} from "discord.js";
import { EventSchema, RSVPUserSchema } from "frontend";
import { DateTime } from "luxon";
import { z } from "zod";
import { ROLES } from "../../constants";
import { statusToEmoji } from "./rsvpToDescription";

export default function rsvpReminderMessage(
  event: z.infer<typeof EventSchema>,
  rsvp: z.infer<typeof RSVPUserSchema>[],
  frontendUrl: string,
): BaseMessageOptions {
  const mentorRSVPs = rsvp.filter((rsvpUser) =>
    rsvpUser.user.roles?.includes(ROLES.MENTOR),
  );

  const otherRSVPs = rsvp.filter(
    (rsvpUser) => !rsvpUser.user.roles?.includes(ROLES.MENTOR),
  );

  const meetingInfo = new EmbedBuilder({
    description: event.description.length ? event.description : undefined,
  })
    .setTitle(event.title)
    .addFields(
      {
        name: "Roles",
        value:
          event.type === "Outreach"
            ? roleMention(ROLES.OUTREACH)
            : event.type === "Mentor"
              ? roleMention(ROLES.MENTOR)
              : event.type === "Social"
                ? roleMention(ROLES.SOCIAL)
                : roleMention(ROLES.EVERYONE),
        inline: true,
      },
      { name: "Type", value: event.type, inline: true },
      { name: "All Day", value: event.allDay ? "Yes" : "No", inline: true },
      {
        name: "Start Time",
        value: time(
          DateTime.fromMillis(Date.parse(event.startDate)).toJSDate(),
          "F",
        ),
        inline: true,
      },
      {
        name: "End Time",
        value: time(
          DateTime.fromMillis(Date.parse(event.endDate)).toJSDate(),
          "F",
        ),
        inline: true,
      },
    )
    .setURL(`${frontendUrl}/events/${event.id}`)
    .setColor("Blue");

  const messageComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${"YES"}`)
      .setStyle(ButtonStyle.Success)
      .setLabel("Coming"),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${"MAYBE"}`)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Maybe"),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${"NO"}`)
      .setStyle(ButtonStyle.Danger)
      .setLabel("Not Coming"),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/rsvp/${"LATE"}`)
      .setStyle(ButtonStyle.Primary)
      .setLabel("Late"),
    new ButtonBuilder()
      .setCustomId(`event/${event.id}/checkin`)
      .setStyle(ButtonStyle.Primary)
      .setLabel("Check In"),
  );

  const embeds: Array<EmbedBuilder> = [meetingInfo];

  if (mentorRSVPs.length) {
    const content = mentorRSVPs
      .map(
        (rawRsvp) =>
          `${rawRsvp.user.username} - ${statusToEmoji(rawRsvp.status)}`,
      )
      .join("\n");
    const count = mentorRSVPs.filter(
      (rsvp) => rsvp.status === "YES" || rsvp.status === "LATE",
    ).length;
    const mentorEmbed = new EmbedBuilder()
      .setTitle(`Mentors (${count})`)
      .setDescription(content)
      .setColor("#ccb010");

    embeds.push(mentorEmbed);
  }

  if (otherRSVPs.length) {
    const content = otherRSVPs
      .map(
        (rawRsvp) =>
          `${rawRsvp.user.username} - ${statusToEmoji(rawRsvp.status)}`,
      )
      .join("\n");
    const count = otherRSVPs.filter(
      (rsvp) => rsvp.status === "YES" || rsvp.status === "LATE",
    ).length;
    const otherEmbed = new EmbedBuilder()
      .setTitle(`Others (${count})`)
      .setDescription(content)
      .setColor("#71d11f");

    embeds.push(otherEmbed);
  }

  return {
    embeds: embeds,
    components: [messageComponent],
  };
}
