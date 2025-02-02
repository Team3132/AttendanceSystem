import db from "@/server/drizzle/db";
import { eventParsingRuleTable, eventTable } from "@/server/drizzle/schema";
import mainLogger from "@/server/logger";
import { generateMessage } from "@/server/services/botService";
import { getDiscordBotAPI } from "@/server/services/discordService";
import { ScheduleSchema } from "@/server/utils/KronosClient";
import { ChannelType } from "@discordjs/core";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { and, between, eq, not } from "drizzle-orm";
import { DateTime } from "luxon";

export const APIRoute = createAPIFileRoute("/api/scheduler/reminder/trigger")({
  GET: async ({ request }) => {
    console.log("GET /api/scheduler/reminder/trigger");
    const body = await request.json();
    const validatedBody = await ScheduleSchema.safeParseAsync(body);

    console.log({ validatedBody });

    if (!validatedBody.success) {
      return json({ success: false, error: "Invalid schedule" });
    }

    const { ruleId } = validatedBody.data.metadata;

    try {
      const rule = await db.query.eventParsingRuleTable.findFirst({
        where: eq(eventParsingRuleTable.id, ruleId),
      });

      if (!rule) {
        throw new Error("Rule not found");
      }

      const startNextDay = DateTime.now().plus({ day: 1 }).startOf("day");

      const endNextDay = startNextDay.endOf("day");

      // events in the next day and that match the rule
      const matchingEvents = await db
        .select({ id: eventTable.id })
        .from(eventTable)
        .where(
          and(
            eq(eventTable.ruleId, ruleId),
            between(
              eventTable.startDate,
              startNextDay.toISO(),
              endNextDay.toISO(),
            ),
            not(eventTable.isPosted),
          ),
        );

      const matchingEventIds = matchingEvents.map((event) => event.id);

      // generate messages for each event (this fetches RSVPs and the event details)
      const notificationMessages = await Promise.all(
        matchingEventIds.map((eventId) => generateMessage({ eventId })),
      );

      const botAPI = getDiscordBotAPI();

      const channel = await botAPI.channels.get(rule.channelId);

      if (channel.type !== ChannelType.GuildText) {
        throw new Error("Channel is not a text channel");
      }

      const messagedEvents = await Promise.allSettled(
        notificationMessages.map((message) =>
          botAPI.channels.createMessage(channel.id, message),
        ),
      );

      // mark events as posted
      const fullSuccess =
        messagedEvents.filter((p) => p.status === "fulfilled").length ===
        matchingEventIds.length;

      // log the events that were not posted
      mainLogger.error(
        `Events not posted: ${messagedEvents.filter((p) => p.status === "rejected").map((p) => p.reason)}`,
      );

      return json({ success: fullSuccess });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      return json({ success: false, error: errorMessage });
    }
  },
});
