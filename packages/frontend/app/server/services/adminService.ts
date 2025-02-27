import { trytm } from "@/utils/trytm";
import { and, asc, eq, gte, not } from "drizzle-orm";
import { ulid } from "ulidx";
import { z } from "zod";
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
import KronosClient from "../utils/KronosClient";
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
    });

  const [apiKey] = apiKeys;

  if (!apiKey)
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occured creating API Key",
    });

  return apiKey;
}

export const EventParsingRuleMetadataSchema = z.object({
  ruleId: z.string(),
});

const parsingRuleWebhookUrl = `${env.VITE_FRONTEND_URL}/api/scheduler/reminder/trigger`;

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

  const kronosURL = env.VITE_KRONOS_URL;

  if (!kronosURL) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Kronos URL not set",
    });
  }

  const kronosClient = new KronosClient(kronosURL);

  const ruleId = ulid();

  const scheduleMetadata: z.infer<typeof EventParsingRuleMetadataSchema> = {
    ruleId,
  };

  const [kronosSchedule, error] = await trytm(
    kronosClient.createSchedule({
      // Create a new schedule in Kronos
      title: name,
      description: `Parsing rule for ${name}`,
      url: parsingRuleWebhookUrl,
      isRecurring: true,
      cronExpr,
      metadata: scheduleMetadata,
    }),
  );

  if (error)
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating parsing rule in Kronos",
    });

  const kronosId = kronosSchedule.id;

  // Create a new parsing rule
  const [parsingRules, scheduleError] = await trytm(
    db
      .insert(eventParsingRuleTable)
      .values({
        id: ruleId,
        kronosId,
        regex,
        channelId,
        roleIds,
        priority,
        isOutreach,
      })
      .returning(),
  );

  const parsingRule = parsingRules?.[0];

  if (!parsingRule || scheduleError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating parsing rule",
    });
  }

  const [_reapplyData, reapplyError] = await trytm(reapplyRules());

  if (reapplyError)
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error reapplying parsing rules",
    });

  return parsingRule;
}

/**
 * Get all parsing rules
 * @returns A list of all parsing rules
 */
export async function getParsingRules() {
  const [parsingRules, parsingRulesError] = await trytm(
    db.query.eventParsingRuleTable.findMany(),
  );

  if (parsingRulesError)
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching parsing rules",
    });

  const promisedKronos = parsingRules.map(async (rule) => {
    if (!env.VITE_KRONOS_URL) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Kronos URL not set",
      });
    }

    const kronosClient = new KronosClient(env.VITE_KRONOS_URL);

    const [kronosRule, error] = await trytm(
      kronosClient.getSchedule(rule.kronosId),
    );

    if (error) {
      throw new ServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error getting parsing rule from Kronos",
      });
    }

    return {
      ...rule,
      kronosRule,
    };
  });

  return Promise.allSettled(promisedKronos).then((res) =>
    res.filter((r) => r.status === "fulfilled").map((r) => r.value),
  );
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
    });
  }

  const [rule] = rules;

  if (!rule) {
    throw new ServerError({
      code: "NOT_FOUND",
      message: "Parsing rule not found",
    });
  }

  if (!env.VITE_KRONOS_URL) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Kronos URL not set",
    });
  }

  const kronosClient = new KronosClient(env.VITE_KRONOS_URL);

  const [kronosRule, kronosRuleError] = await trytm(
    kronosClient.getSchedule(rule.kronosId),
  );

  if (kronosRuleError)
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error getting parsing rule from Kronos",
    });

  return {
    ...rule,
    kronosRule,
  };
};

/**
 * Delete a parsing rule
 * @param id The ID of the parsing rule to delete
 * @returns The deleted parsing rule
 */
export async function deleteParsingRule(id: string) {
  if (!env.VITE_KRONOS_URL) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Kronos URL not set",
    });
  }

  const kronosClient = new KronosClient(env.VITE_KRONOS_URL);

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
    });
  }

  const [rule] = rules;

  if (!rule) {
    throw new ServerError({
      code: "NOT_FOUND",
      message: "Parsing rule not found",
    });
  }

  const [_deleteData, kronosDeleteError] = await trytm(
    kronosClient.deleteSchedule(rule.kronosId),
  );

  if (kronosDeleteError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deleting parsing rule from Kronos",
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
    });
  }

  const [rule] = rules;

  if (!rule) {
    throw new ServerError({
      code: "NOT_FOUND",
      message: "Parsing rule not found",
    });
  }

  if (!env.VITE_KRONOS_URL) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Kronos URL not set",
    });
  }

  const kronosClient = new KronosClient(env.VITE_KRONOS_URL);

  const [triggerData, triggerError] = await trytm(
    kronosClient.triggerSchedule(rule.kronosId),
  );

  if (triggerError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error triggering parsing rule",
    });
  }

  return triggerData;
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
      .from(eventTable)
      .where(
        and(gte(eventTable.startDate, new Date()), not(eventTable.isPosted)),
      ),
  );

  if (futureEventsError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching future events",
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
      });
    }
  }
};
