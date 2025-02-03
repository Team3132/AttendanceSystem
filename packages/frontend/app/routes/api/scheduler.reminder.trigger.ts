import db from "@/server/drizzle/db";
import { eventParsingRuleTable, eventTable } from "@/server/drizzle/schema";
import env from "@/server/env";
import mainLogger from "@/server/logger";
import { generateMessage } from "@/server/services/botService";
import { getDiscordBotAPI } from "@/server/services/discordService";
import KronosClient, { ScheduleSchema } from "@/server/utils/KronosClient";
import { ChannelType } from "@discordjs/core";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { and, between, eq, inArray, not } from "drizzle-orm";
import { DateTime } from "luxon";

export const APIRoute = createAPIFileRoute("/api/scheduler/reminder/trigger")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const validatedBody = await ScheduleSchema.safeParseAsync(body);

      if (!validatedBody.success) {
        return json({ success: false, error: "Invalid schedule" });
      }

      const { ruleId } = validatedBody.data.metadata;

      const rule = await db.query.eventParsingRuleTable.findFirst({
        where: eq(eventParsingRuleTable.id, ruleId),
      });

      if (!rule) {
        // attempt to delete the kronos schedule
        if (env.VITE_KRONOS_URL) {
          const kronosClient = new KronosClient(env.VITE_KRONOS_URL);
          try {
            await kronosClient.deleteSchedule(validatedBody.data.id);
          } catch {
            console.error("Failed to delete schedule");
          }
        }

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
        matchingEventIds.map(
          async (eventId) =>
            [eventId, await generateMessage({ eventId })] as const,
        ),
      );

      const botAPI = getDiscordBotAPI();

      const channel = await botAPI.channels.get(rule.channelId);

      if (channel.type !== ChannelType.GuildText) {
        throw new Error("Channel is not a text channel");
      }

      const messagedEvents = await Promise.allSettled(
        notificationMessages.map(
          async ([eventId, message]) =>
            [
              eventId,
              await botAPI.channels.createMessage(channel.id, message),
            ] as const,
        ),
      );

      // mark events as posted
      const fullSuccess =
        messagedEvents.filter((p) => p.status === "fulfilled").length ===
        matchingEventIds.length;

      // log the events that were not posted
      const rejectedEventsMessages = messagedEvents
        .filter((p) => p.status === "rejected")
        .map((p) => p.reason);

      if (rejectedEventsMessages.length > 0) {
        mainLogger.error(
          `Events not posted: ${rejectedEventsMessages.join(", ")}`,
        );
      }

      mainLogger.success(
        `Posted ${matchingEventIds.length} events for rule ${ruleId}`,
      );

      const successfullyPostedEvents = messagedEvents
        .filter((p) => p.status === "fulfilled")
        .map((p) => p.value[0]);

      await db
        .update(eventTable)
        .set({
          isPosted: true,
        })
        .where(inArray(eventTable.id, successfullyPostedEvents));

      return json({ success: fullSuccess });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      mainLogger.error("Error triggering reminders", error);
      return json({ success: false, error: errorMessage });
    }
  },
});
