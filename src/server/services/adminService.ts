import { getSdk } from "@/gql";
import { adminMiddleware } from "@/middleware/authMiddleware";
import { UpdateEventParsingRuleSchema } from "@/server/schema";
import { trytm } from "@/utils/trytm";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { GraphQLClient } from "graphql-request";
import { ulid } from "ulidx";
import { z } from "zod";
import { eventParsingRuleTable, eventTable } from "../drizzle/schema";
import env from "../env";
import { NewEventParsingRuleSchema } from "../schema";
import { ServerError } from "../utils/errors";
import { strToRegex } from "../utils/regexBuilder";

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

    const webhookServerUrl = env.WEBHOOK_SERVER;

    if (!webhookServerUrl) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Webhook server url",
      });
    }

    const client = getSdk(new GraphQLClient(webhookServerUrl));

    const ruleId = ulid();

    const [cronWebhookResponse, error] = await trytm(
      client.CreateWebhook({
        cronExpression: cronExpr,
        url: `${env.VITE_FRONTEND_URL}/api/scheduler/reminder/trigger?ruleId=${ruleId}`,
      }),
    );

    if (error || cronWebhookResponse?.errors)
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating cron webhook job",
        cause: error,
      });

    const cronId = cronWebhookResponse.data.createCronWebhook.id;

    // Create a new parsing rule
    const [parsingRules, scheduleError] = await trytm(
      db
        .insert(eventParsingRuleTable)
        .values({
          id: ruleId,
          cronId,
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
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating parsing rule",
        cause: scheduleError,
      });
    }

    const [_reapplyData, reapplyError] = await trytm(reapplyRules());

    if (reapplyError)
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error reapplying parsing rules",
        cause: reapplyError,
      });

    return parsingRule;
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
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching parsing rule",
        cause: ruleGetError,
      });
    }

    const [rule] = rules;

    if (!rule) {
      throw new ServerError({
        code: "NOT_FOUND",
        message: "Parsing rule not found",
      });
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
    if (!env.WEBHOOK_SERVER) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Webhook server URL not set",
      });
    }

    const sdk = getSdk(new GraphQLClient(env.WEBHOOK_SERVER));

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
      });
    }

    const [_deleteData, webhookDeleteError] = await trytm(
      sdk.DeleteWebhook({
        id,
      }),
    );

    if (webhookDeleteError) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error deleting parsing rule from the Webhook Server",
        cause: webhookDeleteError,
      });
    }

    const [_deletedRule, _deleteError] = await trytm(
      db.delete(eventParsingRuleTable).where(eq(eventParsingRuleTable.id, id)),
    );

    const [_reapplyData, reapplyError] = await trytm(reapplyRules());

    if (reapplyError) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error reapplying parsing rules",
        cause: reapplyError,
      });
    }

    return rule;
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
      throw new ServerError({
        code: "NOT_FOUND",
        message: "Parsing rule not found",
        cause: updateError,
      });
    }

    const [rule] = updatedRules;

    if (!rule) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error updating parsing rule",
      });
    }

    const [_reapplyData, reapplyError] = await trytm(reapplyRules());

    if (reapplyError) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error reapplying parsing rules",
        cause: reapplyError,
      });
    }

    return rule;
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

    if (!env.WEBHOOK_SERVER) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Webhook server URL not set",
      });
    }

    const sdk = getSdk(new GraphQLClient(env.WEBHOOK_SERVER));

    const [triggerData, triggerError] = await trytm(
      sdk.TriggerWebhook({
        id: rule.cronId,
      }),
    );

    if (triggerError || triggerData.errors) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error triggering parsing rule",
        cause: triggerError,
      });
    }

    return triggerData.data;
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
        .from(eventTable),
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
      let newRuleId: null | string = null;

      for (const filter of filters) {
        const reg = strToRegex(filter.regex);

        if (reg.test(event.title) || reg.test(event.description)) {
          newRuleId = filter.id;
        }
      }

      if (newRuleId !== event.existingRuleId) {
        updatedEvents.push({
          id: event.id,
          ruleId: newRuleId,
        });
      }
    }

    for (const event of updatedEvents) {
      const [_updatedEvent, updateEventError] = await trytm(
        db
          .update(eventTable)
          .set({
            ruleId: event.ruleId,
          })
          .where(eq(eventTable.id, event.id)),
      );

      if (updateEventError) {
        throw new ServerError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating event",
          cause: updateEventError,
        });
      }
    }
  });
