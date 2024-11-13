import { ROLES } from "@/constants";
import type {
  EventSchema,
  RSVPUserSchema,
} from "../../../../frontend/src/api/schema";
import {
  ActionRowBuilder,
  type BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  roleMention,
  time,
} from "discord.js";
import { DateTime } from "luxon";
import type { z } from "zod";
import rsvpToDescription from "./rsvpToDescription";

export default function rsvpReminderMessage(
  event: z.infer<typeof EventSchema>,
  rsvp: z.infer<typeof RSVPUserSchema>[],
  frontendUrl: string,
): BaseMessageOptions {
  const clonedRsvp = [...rsvp];

  const sortedByCreated = clonedRsvp.sort(
    (rsvpA, rsvpB) =>
      DateTime.fromMillis(Date.parse(rsvpB.createdAt)).toMillis() -
      DateTime.fromMillis(Date.parse(rsvpA.createdAt)).toMillis(),
  );

  const firstId = sortedByCreated.at(-1)?.id;

  const mentorRSVPs = rsvp.filter((rsvpUser) =>
    rsvpUser.user.roles?.includes(ROLES.MENTOR),
  );

  const otherRSVPs = rsvp.filter(
    (rsvpUser) => !rsvpUser.user.roles?.includes(ROLES.MENTOR),
  );

  const mentorDescription = mentorRSVPs.length
    ? mentorRSVPs
        .map((rawRsvp) => rsvpToDescription(rawRsvp, rawRsvp.id === firstId))
        .join("\n")
    : undefined;

  const otherDescription = otherRSVPs.length
    ? otherRSVPs
        .map((rawRsvp) => rsvpToDescription(rawRsvp, rawRsvp.id === firstId))
        .join("\n")
    : undefined;

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
        ),
        inline: true,
      },
      {
        name: "End Time",
        value: time(DateTime.fromMillis(Date.parse(event.endDate)).toJSDate()),
        inline: true,
      },
    )
    .setURL(`${frontendUrl}/events/${event.id}`)
    .setColor("Blue");

  const comingMentorCount = mentorRSVPs.filter(
    (rsvp) => rsvp.status === "YES" || rsvp.status === "LATE",
  ).length;

  const comingStudentCount = otherRSVPs.filter(
    (rsvp) => rsvp.status === "YES" || rsvp.status === "LATE",
  ).length;

  const mentorEmbed = mentorDescription
    ? new EmbedBuilder()
        .setTitle(`Mentors (${comingMentorCount})`)
        .setDescription(mentorDescription)
        .setColor("#ccb010")
    : undefined;

  const otherEmbed = otherDescription
    ? new EmbedBuilder()
        .setTitle(`Others (${comingStudentCount})`)
        .setDescription(otherDescription)
        .setColor("#71d11f")
    : undefined;

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
    // new ButtonBuilder()
    //   .setCustomId(`event/${event.id}/checkout`)
    //   .setStyle(ButtonStyle.Primary)
    //   .setLabel('Check Out'),
  );

  const embeds: Array<EmbedBuilder> = [meetingInfo];

  if (mentorEmbed) embeds.push(mentorEmbed);

  if (otherEmbed) embeds.push(otherEmbed);

  return {
    embeds: embeds,
    components: [messageComponent],
  };
}
