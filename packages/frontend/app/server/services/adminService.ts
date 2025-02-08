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
import mainLogger from "../logger";
import type {
  NewEventParsingRuleSchema,
  UpdateEventParsingRuleSchema,
} from "../schema";
import KronosClient from "../utils/KronosClient";
import { createServerError } from "../utils/errors";
import { strToRegex } from "../utils/regexBuilder";

/**
 * Get all API keys
 * @returns A list of all API keys
 */
export async function getApiKeys() {
  const apiKeys = await db.query.apiKeyTable.findMany();

  return apiKeys;
}

/**
 * Delete an API key
 * @param id The ID of the API key to delete
 * @returns The deleted API key
 */
export async function deleteApiKey(id: string) {
  const [deleted] = await db
    .delete(apiKeyTable)
    .where(eq(apiKeyTable.id, id))
    .returning();

  return deleted;
}

/**
 * Create a new API key
 * @param userId The ID of the user creating the API key
 * @returns The created API key
 */
export async function createApiKey(userId: string, name: string) {
  const [apiKey] = await db
    .insert(apiKeyTable)
    .values({
      name,
      createdBy: userId,
    })
    .returning();

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
    throw createServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Kronos URL not set",
    });
  }

  const kronosClient = new KronosClient(kronosURL);

  const ruleId = ulid();

  const scheduleMetadata: z.infer<typeof EventParsingRuleMetadataSchema> = {
    ruleId,
  };

  const { id: kronosId } = await kronosClient.createSchedule({
    // Create a new schedule in Kronos
    title: name,
    description: `Parsing rule for ${name}`,
    url: parsingRuleWebhookUrl,
    isRecurring: true,
    cronExpr,
    metadata: scheduleMetadata,
  });

  // Create a new parsing rule
  const [parsingRule] = await db
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
    .returning();

  if (!parsingRule) {
    throw createServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error creating parsing rule",
    });
  }

  await reapplyRules();

  return parsingRule;
}

/**
 * Get all parsing rules
 * @returns A list of all parsing rules
 */
export async function getParsingRules() {
  const parsingRules = await db.query.eventParsingRuleTable.findMany();

  const promisedKronos = parsingRules.map(async (rule) => {
    if (!env.VITE_KRONOS_URL) {
      throw createServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Kronos URL not set",
      });
    }

    const kronosClient = new KronosClient(env.VITE_KRONOS_URL);

    try {
      const kronosRule = await kronosClient.getSchedule(rule.kronosId);

      return {
        ...rule,
        kronosRule,
      };
    } catch {
      deleteParsingRule(rule.id);
      throw createServerError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error getting parsing rule from Kronos",
      });
    }
  });

  return Promise.all(promisedKronos);
}

/**
 * Get a parsing rule
 * @param id The ID of the parsing rule to get
 * @returns The parsing rule
 */
export const getParsingRule = async (id: string) => {
  const [rule] = await db
    .select()
    .from(eventParsingRuleTable)
    .where(eq(eventParsingRuleTable.id, id));

  if (!rule) {
    throw createServerError({
      code: "NOT_FOUND",
      message: "Parsing rule not found",
    });
  }

  if (!env.VITE_KRONOS_URL) {
    throw createServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Kronos URL not set",
    });
  }

  const kronosClient = new KronosClient(env.VITE_KRONOS_URL);

  try {
    const kronosRule = await kronosClient.getSchedule(rule.kronosId);

    return {
      ...rule,
      kronosRule,
    };
  } catch {
    deleteParsingRule(rule.id);
  }
};

/**
 * Delete a parsing rule
 * @param id The ID of the parsing rule to delete
 * @returns The deleted parsing rule
 */
export async function deleteParsingRule(id: string) {
  if (!env.VITE_KRONOS_URL) {
    throw createServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Kronos URL not set",
    });
  }

  const kronosClient = new KronosClient(env.VITE_KRONOS_URL);

  const [rule] = await db
    .select()
    .from(eventParsingRuleTable)
    .where(eq(eventParsingRuleTable.id, id));

  if (!rule) {
    throw createServerError({
      code: "NOT_FOUND",
      message: "Parsing rule not found",
    });
  }
  try {
    await kronosClient.deleteSchedule(rule.kronosId);
  } catch {
    console.log("Error");
  }

  try {
    await db
      .delete(eventParsingRuleTable)
      .where(eq(eventParsingRuleTable.id, id));
  } catch {
    console.log("error");
  }

  await reapplyRules();

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
  const [updated] = await db
    .update(eventParsingRuleTable)
    .set({
      channelId,
      regex,
      roleIds,
      priority,
      isOutreach,
    })
    .where(eq(eventParsingRuleTable.id, id))
    .returning();

  if (!updated) {
    throw createServerError({
      code: "NOT_FOUND",
      message: "Parsing rule not found",
    });
  }

  await reapplyRules();

  return updated;
}

export const triggerRule = async (id: string) => {
  const [rule] = await db
    .select()
    .from(eventParsingRuleTable)
    .where(eq(eventParsingRuleTable.id, id));

  if (!rule) {
    throw createServerError({
      code: "NOT_FOUND",
      message: "Parsing rule not found",
    });
  }

  if (!env.VITE_KRONOS_URL) {
    throw createServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Kronos URL not set",
    });
  }

  const kronosClient = new KronosClient(env.VITE_KRONOS_URL);

  try {
    await kronosClient.triggerSchedule(rule.kronosId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error triggering parsing rule";
    throw createServerError({
      code: "INTERNAL_SERVER_ERROR",
      message,
    });
  }
};

const reapplyRules = async () => {
  try {
    const futureEvents = await db
      .select({
        id: eventTable.id,
        title: eventTable.title,
        description: eventTable.description,
        existingRuleId: eventTable.ruleId,
      })
      .from(eventTable)
      .where(
        and(
          gte(eventTable.startDate, new Date().toISOString()),
          not(eventTable.isPosted),
        ),
      );

    const filters = await db
      .select({
        id: eventParsingRuleTable.id,
        regex: eventParsingRuleTable.regex,
        priority: eventParsingRuleTable.priority,
      })
      .from(eventParsingRuleTable)
      .orderBy(asc(eventParsingRuleTable.priority));

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
      await db
        .update(eventTable)
        .set({
          ruleId: event.ruleId,
        })
        .where(eq(eventTable.id, event.id));
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error reapplying parsing rules";

    mainLogger.error(message);
  }
};
