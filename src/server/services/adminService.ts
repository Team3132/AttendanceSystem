import { adminMiddleware } from "@/middleware/authMiddleware";
import { logger } from "@/utils/logger";
import { trytm } from "@/utils/trytm";
import { ChannelType } from "@discordjs/core";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { Cron, scheduledJobs } from "croner";
import { and, asc, between, eq, inArray, not } from "drizzle-orm";
import { DateTime } from "luxon";
import { ulid } from "ulidx";
import { z } from "zod";
import type { DB } from "../drizzle/db";
import { eventParsingRuleTable, eventTable } from "../drizzle/schema";
import env from "../env";
import { NewEventParsingRuleSchema } from "../schema/NewEventParsingRuleSchema";
import { UpdateEventParsingRuleSchema } from "../schema/UpdateEventParsingRuleSchema";
import { ServerError } from "../utils/errors";
import { strToRegex } from "../utils/regexBuilder";
import { generateMessage } from "./botService";
import { getDiscordBotAPI } from "./discordService";

/**
 * This is the function that gets run every time a cron job is triggered
 */
export const reminderFn = createServerOnlyFn(async (job: Cron, db: DB) => {
  if (!job.name) return;

  const rule = await db.query.eventParsingRuleTable.findFirst({
    where: eq(eventParsingRuleTable.id, job.name),
  });

  if (!rule) {
    throw new Error("Rule not found");
  }

  const nextRun = job.nextRun();

  let eventRangeEnd = DateTime.now().plus({ day: 1 }).startOf("day").toJSDate();

  const nextRunDate = nextRun ? DateTime.fromJSDate(nextRun) : null;
  if (nextRunDate?.isValid) {
    eventRangeEnd = nextRunDate.endOf("day").toJSDate();
  }

  // events in the next day and that match the rule
  const matchingEvents = await db
    .select({ id: eventTable.id })
    .from(eventTable)
    .where(
      and(
        eq(eventTable.ruleId, job.name),
        between(eventTable.startDate, new Date(), eventRangeEnd),
        not(eventTable.isPosted),
      ),
    );

  const matchingEventIds = matchingEvents.map((event) => event.id);

  // generate messages for each event (this fetches RSVPs and the event details)
  const notificationMessages = await Promise.all(
    matchingEventIds.map(
      async (eventId) => [eventId, await generateMessage(db, eventId)] as const,
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

  // log the events that were not posted
  const rejectedEventsMessages = messagedEvents
    .filter((p) => p.status === "rejected")
    .map((p) => p.reason);

  if (rejectedEventsMessages.length > 0) {
    logger.error(`Events not posted: ${rejectedEventsMessages.join(", ")}`);
  }

  logger.success(
    `Posted ${matchingEventIds.length} events for rule ${job.name}`,
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

  await db
    .update(eventParsingRuleTable)
    .set({
      lastRun: new Date(),
    })
    .where(eq(eventParsingRuleTable.id, job.name));
});

/**
 * Create a new parsing rule
 * @param data The data to create a new parsing rule
 * @returns The created parsing rule
 */
export const createParsingRule = createServerFn({
  method: "POST",
})
  .inputValidator(NewEventParsingRuleSchema)
  .middleware([adminMiddleware])
  .handler(async ({ data, context: { db } }) => {
    const { name, regex, cronExpr, channelId, roleIds, priority, isOutreach } =
      data;

    const ruleId = ulid();

    const job = new Cron(cronExpr, { name: ruleId, timezone: env.TZ }, (job) =>
      reminderFn(job, db),
    );

    // Create a new parsing rule
    const [parsingRules, scheduleError] = await trytm(
      db
        .insert(eventParsingRuleTable)
        .values({
          id: ruleId,
          regex,
          channelId,
          roleIds,
          priority,
          isOutreach,
          name,
          cronExpr,
        })
        .returning(),
    );

    const parsingRule = parsingRules?.[0];

    if (!parsingRule || scheduleError) {
      job.stop();
      setResponseStatus(500);
      throw new Error("Error creating parsing rule", {
        cause: scheduleError,
      });
    }

    const [reapplyData, reapplyError] = await trytm(reapplyRules());

    if (reapplyError) {
      setResponseStatus(500);
      throw new Error("Error reapplying parsing rules", {
        cause: reapplyError,
      });
    }

    return {
      ...parsingRule,
      updatedEventCount: reapplyData.updatedEventCount,
    };
  });

/**
 * Get all parsing rules
 * @returns A list of all parsing rules
 */
export const getParsingRules = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const [parsingRules, parsingRulesError] = await trytm(
      db
        .select()
        .from(eventParsingRuleTable)
        .orderBy(asc(eventParsingRuleTable.priority)),
    );

    if (parsingRulesError)
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching parsing rules",
        cause: parsingRulesError,
      });

    return parsingRules;
  });

/**
 * Get a parsing rule
 * @param id The ID of the parsing rule to get
 * @returns The parsing rule
 */
export const getParsingRule = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .middleware([adminMiddleware])
  .handler(async ({ data: id, context: { db } }) => {
    const [rules, ruleGetError] = await trytm(
      db
        .select()
        .from(eventParsingRuleTable)
        .where(eq(eventParsingRuleTable.id, id)),
    );

    if (ruleGetError) {
      setResponseStatus(500);
      throw new Error("Error fetching parsing rule", {
        cause: ruleGetError,
      });
    }

    const [rule] = rules;

    if (!rule) {
      setResponseStatus(404);
      throw new Error("Parsing rule not found");
    }

    return rule;
  });

/**
 * Delete a parsing rule
 * @param id The ID of the parsing rule to delete
 * @returns The deleted parsing rule
 */
export const deleteParsingRule = createServerFn({
  method: "POST",
})
  .inputValidator(z.string())
  .middleware([adminMiddleware])
  .handler(async ({ data: id, context: { db } }) => {
    const [rules, ruleFetchError] = await trytm(
      db
        .select()
        .from(eventParsingRuleTable)
        .where(eq(eventParsingRuleTable.id, id)),
    );

    if (ruleFetchError) {
      setResponseStatus(500);
      throw new Error("Error fetching parsing rule", {
        cause: ruleFetchError,
      });
    }

    const [rule] = rules;

    if (!rule) {
      setResponseStatus(404);
      throw new Error("Parsing rule not found");
    }

    scheduledJobs.find((job) => job.name === id)?.stop();

    const [_deleteResult, deleteError] = await trytm(
      db
        .delete(eventParsingRuleTable)
        .where(eq(eventParsingRuleTable.id, id))
        .returning(),
    );

    if (deleteError) {
      setResponseStatus(500);
      throw new Error("Failed to delete parsing rule", {
        cause: deleteError,
      });
    }

    const [reapplyData, reapplyError] = await trytm(reapplyRules());

    if (reapplyError) {
      setResponseStatus(500);
      throw new Error("Error reapplying parsing rules", {
        cause: reapplyError,
      });
    }

    logger.success(`Successfully Deleted: ${rule.name} (${rule.id})`);

    return {
      ...rule,
      updatedEventCount: reapplyData.updatedEventCount,
    };
  });

const UpdateRuleSchema = UpdateEventParsingRuleSchema.extend({
  id: z.string().nonempty(),
});

/**
 * Update a parsing rule
 * @param id The ID of the parsing rule to update
 * @param data The data to update the parsing rule with
 * @returns The updated parsing rule
 */
export const updateParsingRule = createServerFn({
  method: "POST",
})
  .inputValidator(UpdateRuleSchema)
  .middleware([adminMiddleware])
  .handler(async ({ data: { id, ...data }, context: { db } }) => {
    const { channelId, regex, roleIds, priority, isOutreach } = data;
    const [updatedRules, updateError] = await trytm(
      db
        .update(eventParsingRuleTable)
        .set({
          channelId,
          regex,
          roleIds,
          priority,
          isOutreach,
        })
        .where(eq(eventParsingRuleTable.id, id))
        .returning(),
    );

    if (updateError) {
      setResponseStatus(404);
      throw new Error("Parsing rule not found", {
        cause: updateError,
      });
    }

    const [rule] = updatedRules;

    if (!rule) {
      setResponseStatus(500);
      throw new Error("Error updating parsing rule");
    }

    const [reapplyData, reapplyError] = await trytm(reapplyRules());

    if (reapplyError) {
      setResponseStatus(500);
      throw new Error("Error reapplying parsing rules", {
        cause: reapplyError,
      });
    }

    return {
      ...rule,
      updatedEventCount: reapplyData.updatedEventCount,
    };
  });

export const triggerRule = createServerFn({
  method: "POST",
})
  .inputValidator(z.string())
  .middleware([adminMiddleware])
  .handler(async ({ data: id, context: { db } }) => {
    const [rules, ruleFetchError] = await trytm(
      db
        .select()
        .from(eventParsingRuleTable)
        .where(eq(eventParsingRuleTable.id, id)),
    );

    if (ruleFetchError) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching parsing rule",
        cause: ruleFetchError,
      });
    }

    const [rule] = rules;

    if (!rule) {
      throw new ServerError({
        code: "NOT_FOUND",
        message: "Parsing rule not found",
        cause: ruleFetchError,
      });
    }

    try {
      await scheduledJobs.find((job) => job.name === id)?.trigger();
      logger.success(`Successfully Triggered: ${rule.name} (${rule.id})`);
    } catch (error) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error triggering parsing rule",
        cause: error,
      });
    }
  });

const reapplyRules = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const [futureEvents, futureEventsError] = await trytm(
      db
        .select({
          id: eventTable.id,
          title: eventTable.title,
          description: eventTable.description,
          existingRuleId: eventTable.ruleId,
        })
        .from(eventTable)
        .orderBy(asc(eventTable.startDate)),
    );

    if (futureEventsError) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching future events",
        cause: futureEventsError,
      });
    }

    const [filters, filtersError] = await trytm(
      db
        .select({
          id: eventParsingRuleTable.id,
          regex: eventParsingRuleTable.regex,
          priority: eventParsingRuleTable.priority,
        })
        .from(eventParsingRuleTable)
        .orderBy(asc(eventParsingRuleTable.priority)),
    );

    if (filtersError) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching parsing rules",
        cause: filtersError,
      });
    }

    const updatedEvents = [];
    for (const event of futureEvents) {
      const ruleMatches = filters.map((filter) => {
        const reg = strToRegex(filter.regex);
        return {
          id: filter.id,
          regex: filter.regex,
          match: reg.test(event.title) || reg.test(event.description),
        };
      });

      const newRuleId = ruleMatches.find((r) => r.match)?.id ?? null;

      logger.debug(`Event "${event.title}" (${event.id}) matches rules:`);

      for (const r of ruleMatches) {
        logger.debug(` - Rule ${r.id} (${r.regex}): ${r.match}`);
      }

      if (newRuleId !== event.existingRuleId) {
        logger.debug(
          `Reapplying rule for event ${event.id}: ${event.existingRuleId} -> ${newRuleId}`,
        );

        updatedEvents.push({
          id: event.id,
          ruleId: newRuleId,
        });
      }
    }

    let updatedEventCount = 0;

    for (const event of updatedEvents) {
      try {
        await db
          .update(eventTable)
          .set({
            ruleId: event.ruleId,
          })
          .where(eq(eventTable.id, event.id));
        updatedEventCount++;
      } catch (error) {
        throw new ServerError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating event",
          cause: error,
        });
      }
    }

    return { updatedEventCount: updatedEventCount };
  });
