import { getSdk } from "@/gql";
import { trytm } from "@/utils/trytm";
import { asc, eq } from "drizzle-orm";
import { GraphQLClient } from "graphql-request";
import { ulid } from "ulidx";
import type { z } from "zod";
import db from "../drizzle/db";
import {
  apiKeyTable,
  eventParsingRuleTable,
  eventTable,
} from "../drizzle/schema";
import env from "../env";
import type {
  NewEventParsingRuleSchema,
  UpdateEventParsingRuleSchema,
} from "../schema";
import { ServerError } from "../utils/errors";
import { strToRegex } from "../utils/regexBuilder";

/**
 * Get all API keys
 * @returns A list of all API keys
 */
export async function getApiKeys() {
  const [apiKeys, error] = await trytm(db.query.apiKeyTable.findMany());

  if (error)
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occured fetching API Keys",
      cause: error,
    });

  return apiKeys;
}

/**
 * Delete an API key
 * @param id The ID of the API key to delete
 * @returns The deleted API key
 */
export async function deleteApiKey(id: string) {
  const [deleted, error] = await trytm(
    db.delete(apiKeyTable).where(eq(apiKeyTable.id, id)).returning(),
  );

  if (error)
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occured deleting API Key",
      cause: error,
    });

  return deleted;
}

/**
 * Create a new API key
 * @param userId The ID of the user creating the API key
 * @returns The created API key
 */
export async function createApiKey(userId: string, name: string) {
  const [apiKeys, error] = await trytm(
    db
      .insert(apiKeyTable)
      .values({
        name,
        createdBy: userId,
      })
      .returning(),
  );

  if (error)
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occured creating API Key",
      cause: error,
    });

  const [apiKey] = apiKeys;

  if (!apiKey)
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occured creating API Key",
      cause: error,
    });

  return apiKey;
}

/**
 * Create a new parsing rule
 * @param data The data to create a new parsing rule
 * @returns The created parsing rule
 */
export async function createParsingRule(
  data: z.infer<typeof NewEventParsingRuleSchema>,
) {
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
}

/**
 * Get all parsing rules
 * @returns A list of all parsing rules
 */
export async function getParsingRules() {
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
}

/**
 * Get a parsing rule
 * @param id The ID of the parsing rule to get
 * @returns The parsing rule
 */
export const getParsingRule = async (id: string) => {
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
};

/**
 * Delete a parsing rule
 * @param id The ID of the parsing rule to delete
 * @returns The deleted parsing rule
 */
export async function deleteParsingRule(id: string) {
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
}

/**
 * Update a parsing rule
 * @param id The ID of the parsing rule to update
 * @param data The data to update the parsing rule with
 * @returns The updated parsing rule
 */
export async function updateParsingRule(
  id: string,
  data: z.infer<typeof UpdateEventParsingRuleSchema>,
) {
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
}

export const triggerRule = async (id: string) => {
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
};

const reapplyRules = async () => {
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
};
