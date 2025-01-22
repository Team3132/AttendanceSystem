import type { z } from "zod";
import type { RSVPUserSchema } from "../schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import {
  eventParsingRuleTable,
  eventTable,
  rsvpTable,
} from "../drizzle/schema";
import env from "../env";
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  roleMention,
  time,
} from "@discordjs/builders";
import { DateTime } from "luxon";
import {
  ButtonStyle,
  type RESTPostAPIChannelMessageJSONBody,
} from "@discordjs/core";

interface MessageParams {
  eventId: string;
}

/**
 * Generates an announcement message for an event
 * @param data The data to generate the message with
 * @returns The message data
 */
export async function generateMessage(data: MessageParams) {
  const { eventId } = data;

  const eventRSVPs = await db.query.rsvpTable.findMany({
    where: eq(rsvpTable.eventId, eventId),
    with: {
      user: {
        columns: {
          roles: true,
          username: true,
        },
      },
    },
  });

  const eventData = await db.query.eventTable.findFirst({
    where: eq(eventTable, eventId),
  });

  if (!eventData) {
    throw new Error("Event not found");
  }

  const { ruleId } = eventData;

  let roleIds: string[] = [];

  if (ruleId === null) {
    roleIds = [env.VITE_GUILD_ID];
  } else {
    const eventRule = await db.query.eventParsingRuleTable.findFirst({
      where: eq(eventParsingRuleTable, ruleId),
    });
    if (!eventRule) {
      throw new Error("Event Rule not found");
    }
    roleIds = eventRule.rolesIds;
  }

  const mentorRSVPs = eventRSVPs.filter((rsvpUser) =>
    rsvpUser.user.roles?.includes(env.VITE_MENTOR_ROLE_ID),
  );

  const otherRSVPs = eventRSVPs.filter(
    (rsvpUser) => !rsvpUser.user.roles?.includes(env.VITE_MENTOR_ROLE_ID),
  );

  /** A list of role mentionds seperated by commas and "and" at the end */
  const roleMentionList = `${roleIds.slice(0, -1).map(roleMention).join(", ")} and ${roleMention(roleIds[roleIds.length - 1])}`;

  const meetingInfo = new EmbedBuilder({
    description: eventData.description.length
      ? eventData.description
      : undefined,
  })
    .setTitle(eventData.title)
    .addFields(
      {
        name: "Roles",
        value: roleMentionList,
        inline: true,
      },
      {
        name: "Start Time",
        value: time(
          DateTime.fromMillis(Date.parse(eventData.startDate)).toJSDate(),
          "F",
        ),
        inline: true,
      },
      {
        name: "End Time",
        value: time(
          DateTime.fromMillis(Date.parse(eventData.endDate)).toJSDate(),
          "F",
        ),
        inline: true,
      },
    )
    .setURL(`${env.VITE_FRONTEND_URL}/events/${eventData.id}`)
    .setColor([49, 49, 96]);

  const messageComponent = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`event/${eventData.id}/rsvp/${"YES"}`)
      .setStyle(ButtonStyle.Success)
      .setLabel("Coming"),
    new ButtonBuilder()
      .setCustomId(`event/${eventData.id}/rsvp/${"MAYBE"}`)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Maybe"),
    new ButtonBuilder()
      .setCustomId(`event/${eventData.id}/rsvp/${"NO"}`)
      .setStyle(ButtonStyle.Danger)
      .setLabel("Not Coming"),
    new ButtonBuilder()
      .setCustomId(`event/${eventData.id}/rsvp/${"LATE"}`)
      .setStyle(ButtonStyle.Primary)
      .setLabel("Late"),
    new ButtonBuilder()
      .setCustomId(`event/${eventData.id}/checkin`)
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
      .setColor([80, 69, 6]);

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
      .setColor([44, 82, 12]);

    embeds.push(otherEmbed);
  }

  return {
    content: `Please RSVP (${roleMentionList})`,
    embeds: embeds.map((embed) => embed.toJSON()),
    components: [messageComponent.toJSON()],
  } satisfies RESTPostAPIChannelMessageJSONBody;
}
