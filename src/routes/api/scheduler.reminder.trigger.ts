import { getSdk } from "@/gql";
import db from "@/server/drizzle/db";
import { eventParsingRuleTable, eventTable } from "@/server/drizzle/schema";
import env from "@/server/env";
import { consola } from "@/server/logger";
import { generateMessage } from "@/server/services/botService";
import { getDiscordBotAPI } from "@/server/services/discordService";
import { trytm } from "@/utils/trytm";
import { ChannelType } from "@discordjs/core";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { and, between, eq, inArray, not } from "drizzle-orm";
import { GraphQLClient } from "graphql-request";
import { DateTime } from "luxon";
import { z } from "zod";

export const Route = createFileRoute("/api/scheduler/reminder/trigger")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const searchParamObject = Object.fromEntries(
            new URL(request.url).searchParams.entries(),
          );

          const searchParamsValidation = await z
            .object({
              ruleId: z.string(),
            })
            .safeParseAsync(searchParamObject);

          if (!searchParamsValidation.success) {
            throw new Error("Rule could not be found");
          }

          const { ruleId } = searchParamsValidation.data;

          const rule = await db.query.eventParsingRuleTable.findFirst({
            where: eq(eventParsingRuleTable.id, ruleId),
          });

          if (!rule) {
            throw new Error("Rule not found");
          }

          if (!env.WEBHOOK_SERVER) {
            throw new Error("Webhook server URL is not configured");
          }

          const sdk = getSdk(new GraphQLClient(env.WEBHOOK_SERVER));

          const [webhookJob, err] = await trytm(
            sdk.Webhook({
              id: rule.cronId,
            }),
          );

          if (err || webhookJob.errors) {
            consola.error("Error fetching webhook job", err);
            throw new Error("Failed to fetch webhook job");
          }

          const nextRun = webhookJob.data.cronWebhook?.nextRun;

          let eventRangeEnd = DateTime.now()
            .plus({ day: 1 })
            .startOf("day")
            .toJSDate();

          const nextRunDate = nextRun ? DateTime.fromISO(nextRun) : null;
          if (nextRunDate?.isValid) {
            eventRangeEnd = nextRunDate.endOf("day").toJSDate();
          }

          // events in the next day and that match the rule
          const matchingEvents = await db
            .select({ id: eventTable.id })
            .from(eventTable)
            .where(
              and(
                eq(eventTable.ruleId, ruleId),
                between(eventTable.startDate, new Date(), eventRangeEnd),
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
            consola.error(
              `Events not posted: ${rejectedEventsMessages.join(", ")}`,
            );
          }

          consola.success(
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

          consola.error("Error triggering reminders", error);
          return json({ success: false, error: errorMessage });
        }
      },
    },
  },
});
