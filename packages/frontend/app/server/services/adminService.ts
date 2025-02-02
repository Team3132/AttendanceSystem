import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { ulid } from "ulidx";
import { z } from "zod";
import db from "../drizzle/db";
import { apiKeyTable, eventParsingRuleTable } from "../drizzle/schema";
import env from "../env";
import type {
  NewEventParsingRuleSchema,
  UpdateEventParsingRuleSchema,
} from "../schema";
import KronosClient from "../utils/KronosClient";

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
export async function createApiKey(userId: string) {
  const [apiKey] = await db
    .insert(apiKeyTable)
    .values({
      createdBy: userId,
    })
    .returning();

  return apiKey;
}

export const EventParsingRuleMetadataSchema = z.object({
  ruleId: z.string(),
});

/**
 * Create a new parsing rule
 * @param data The data to create a new parsing rule
 * @returns The created parsing rule
 */
export async function createParsingRule(
  data: z.infer<typeof NewEventParsingRuleSchema>,
) {
  const { name, regex, cronExpr, channelId, roleIds } = data;

  const kronosURL = env.VITE_KRONOS_URL;

  if (!kronosURL) {
    throw new TRPCError({
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
    url: "http://localhost:1420/api/scheduler/reminder/trigger",
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
    })
    .returning();

  if (!parsingRule) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
    });
  }

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
      throw new TRPCError({
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
  });

  return Promise.all(promisedKronos);
}

/**
 * Delete a parsing rule
 * @param id The ID of the parsing rule to delete
 * @returns The deleted parsing rule
 */
export async function deleteParsingRule(id: string) {
  if (!env.VITE_KRONOS_URL) {
    throw new TRPCError({
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
    throw new TRPCError({
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
  const { channelId, regex, roleIds } = data;
  const [updated] = await db
    .update(eventParsingRuleTable)
    .set({
      channelId,
      regex,
      roleIds,
    })
    .where(eq(eventParsingRuleTable.id, id))
    .returning();

  if (!updated) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Parsing rule not found",
    });
  }

  return updated;
}

export async function duplicateParsingRule(id: string) {
  if (!env.VITE_KRONOS_URL) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Kronos URL not set",
    });
  }

  const [rule] = await db
    .select()
    .from(eventParsingRuleTable)
    .where(eq(eventParsingRuleTable.id, id));

  if (!rule) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Parsing rule not found",
    });
  }

  const newRuleId = ulid();

  const kronosClient = new KronosClient(env.VITE_KRONOS_URL);

  const scheduleMetadata: z.infer<typeof EventParsingRuleMetadataSchema> = {
    ruleId: newRuleId,
  };

  const prevRule = await kronosClient.getSchedule(rule.kronosId);

  if (!prevRule) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Parsing rule not found in Kronos",
    });
  }

  const { id: kronosId } = await kronosClient.createSchedule({
    title: `${prevRule.title} (Copy)`,
    description: `Parsing rule for ${prevRule.title} (Copy)`,
    url: "http://localhost:1420/api/scheduler/reminder/trigger",
    isRecurring: true,
    cronExpr: prevRule.cronExpr,
    metadata: scheduleMetadata,
  });

  const [newlyCreatedRule] = await db
    .insert(eventParsingRuleTable)
    .values({
      id: newRuleId,
      regex: rule.regex,
      channelId: rule.channelId,
      roleIds: rule.roleIds,
      kronosId,
    })
    .returning();

  if (!newlyCreatedRule) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error duplicating parsing rule",
    });
  }

  return newlyCreatedRule;
}
