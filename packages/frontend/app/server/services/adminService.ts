import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import type { z } from "zod";
import db from "../drizzle/db";
import { apiKeyTable, eventParsingRuleTable } from "../drizzle/schema";
import type {
  NewEventParsingRuleSchema,
  UpdateEventParsingRuleSchema,
} from "../schema";

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

/**
 * Create a new parsing rule
 * @param data The data to create a new parsing rule
 * @returns The created parsing rule
 */
export async function createParsingRule(
  data: z.infer<typeof NewEventParsingRuleSchema>,
) {
  const { channelId, name, regex, rolesIds } = data;
  // Create a new parsing rule
  const [parsingRule] = await db
    .insert(eventParsingRuleTable)
    .values({
      channelId,
      name,
      regex,
      rolesIds,
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

  return parsingRules;
}

/**
 * Delete a parsing rule
 * @param id The ID of the parsing rule to delete
 * @returns The deleted parsing rule
 */
export async function deleteParsingRule(id: string) {
  const [deleted] = await db
    .delete(eventParsingRuleTable)
    .where(eq(eventParsingRuleTable.id, id))
    .returning();

  return deleted;
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
  const { channelId, name, regex, rolesIds } = data;
  const [updated] = await db
    .update(eventParsingRuleTable)
    .set({
      channelId,
      name,
      regex,
      rolesIds,
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
