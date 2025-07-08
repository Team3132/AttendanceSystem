import { trytm } from "@/utils/trytm";
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  roleMention,
  time,
} from "@discordjs/builders";
import {
  ButtonStyle,
  type RESTPostAPIChannelMessageJSONBody,
} from "@discordjs/core";
import { asc, eq } from "drizzle-orm";
import { DateTime } from "luxon";
import type { z } from "zod";
import db from "../drizzle/db";
import {
  eventParsingRuleTable,
  eventTable,
  rsvpTable,
  userTable,
} from "../drizzle/schema";
import env from "../env";
import type { RSVPUserSchema } from "../schema";

interface MessageParams {
  eventId: string;
}

const statusToEmoji = (
  status: z.infer<typeof RSVPUserSchema>["status"],
  delay?: string,
) => {
  switch (status) {
    case "YES":
      return ":white_check_mark:";
    case "NO":
      return ":x:";
    case "MAYBE":
      return ":grey_question:";
    case "LATE":
      return delay ? `:clock3: - ${delay} late` : ":clock3:";
    case "ATTENDED":
      return ":ok:";
    default:
      return "";
  }
};

// biome-ignore lint/suspicious/noExplicitAny: Using any here is acceptable for grouping logic
const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce(
    (previous, currentItem) => {
      const group = getKey(currentItem);
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    },
    {} as Record<K, T[]>,
  );

/**
 * Generates an announcement message for an event
 * @param data The data to generate the message with
 * @returns The message data
 */
export async function generateMessage(data: MessageParams) {
  const { eventId } = data;

  const [eventRSVPs, eventRsvpsError] = await trytm(
    db
      .select({
        arrivingAt: rsvpTable.arrivingAt,
        status: rsvpTable.status,
        user: {
          username: userTable.username,
          roles: userTable.roles,
          id: userTable.id,
        },
      })
      .from(rsvpTable)
      .innerJoin(userTable, eq(rsvpTable.userId, userTable.id))
      .where(eq(rsvpTable.eventId, eventId))
      .orderBy(asc(userTable.username)),
  );

  if (eventRsvpsError) {
    throw new Error("Error fetching RSVPs");
  }

  const [eventData, eventDataError] = await trytm(
    db.query.eventTable.findFirst({
      where: eq(eventTable.id, eventId),
    }),
  );

  if (eventDataError) {
    throw new Error("Error fetching event");
  }

  if (!eventData) {
    throw new Error("Event not found");
  }

  const { ruleId } = eventData;

  const roleIds: string[] = [];

  if (ruleId === null) {
    roleIds.push(env.GUILD_ID);
  } else {
    const [eventRule, eventRuleError] = await trytm(
      db.query.eventParsingRuleTable.findFirst({
        where: eq(eventParsingRuleTable.id, ruleId),
      }),
    );

    if (eventRuleError) {
      throw new Error("Error fetching event rule");
    }

    if (!eventRule) {
      throw new Error("Event Rule not found");
    }
    roleIds.push(...eventRule.roleIds);
  }

  /** A list of role mentionds seperated by commas and "and" at the end */
  const roleMentionList =
    roleIds.length > 1
      ? `${roleIds.slice(0, -1).map(roleMention).join(", ")} and ${roleMention(roleIds[roleIds.length - 1])}`
      : roleMention(roleIds[0]);

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
        value: time(eventData.startDate, "F"),
        inline: true,
      },
      {
        name: "End Time",
        value: time(eventData.endDate, "F"),
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

  const eventStart = DateTime.fromJSDate(eventData.startDate);

  // Group RSVPs by role with each user only appearing once
  const groupedRSVPs = groupBy(
    eventRSVPs,
    (rsvp) =>
      rsvp.user.roles?.filter((role) => roleIds.includes(role))[0] ?? "No Role",
  );

  for (const [roleId, rsvps] of Object.entries(groupedRSVPs)) {
    const embed = rsvpsToEmbed(rsvps, eventStart, roleId);
    embeds.push(embed);
  }

  return {
    content: `Please RSVP (${roleMentionList})`,
    embeds: embeds.map((embed) => embed.toJSON()),
    components: [messageComponent.toJSON()],
  } satisfies RESTPostAPIChannelMessageJSONBody;
}

function rsvpToString(eventStart: DateTime<true> | DateTime<false>): (value: {
  arrivingAt: Date | null;
  status: "LATE" | "MAYBE" | "NO" | "YES" | "ATTENDED" | null;
  user: { username: string };
}) => string {
  return (rawRsvp) => {
    const arrivingAt = rawRsvp.arrivingAt
      ? DateTime.fromJSDate(rawRsvp.arrivingAt)
      : null;

    const delay =
      arrivingAt?.isValid && eventStart
        ? arrivingAt.diff(eventStart, "minutes").rescale().toHuman()
        : undefined;

    return `${rawRsvp.user.username} - ${statusToEmoji(rawRsvp.status, delay)}`;
  };
}

function rsvpsToEmbed(
  rsvps: Array<{
    arrivingAt: Date | null;
    status: "LATE" | "MAYBE" | "NO" | "YES" | "ATTENDED" | null;
    user: { username: string };
  }>,
  eventStart: DateTime<true> | DateTime<false>,
  roleId?: string,
): EmbedBuilder {
  const count = rsvps.filter(
    (rsvp) => rsvp.status === "YES" || rsvp.status === "LATE",
  ).length;
  const rsvpTitle = roleId
    ? `### ${roleMention(roleId)} (${count})`
    : `### No Role (${count})`;

  const rsvpsContent = rsvps.map(rsvpToString(eventStart)).join("\n");

  const content = `${rsvpTitle}\n${rsvpsContent}`;

  const embed = new EmbedBuilder().setDescription(content);
  return embed;
}
