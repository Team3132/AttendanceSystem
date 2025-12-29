import env from "@/server/env";
import { consola } from "@/server/logger";
import type { APIInteraction } from "@discordjs/core";
import type { ConsolaInstance } from "consola";
import { verifyKey } from "discord-interactions";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const verifyDiscordMiddleware = createMiddleware<{
  Variables: {
    interaction: APIInteraction;
    logger: ConsolaInstance;
  };
}>(async (c, next) => {
  const signature = c.req.header("X-Signature-Ed25519");
  const timestamp = c.req.header("X-Signature-Timestamp");

  /** Child logger for interaction logging (passed to request context) */
  const logger = consola.withTag("interaction");

  logger.debug(
    `Received interaction with signature: ${signature}, timestamp: ${timestamp}`,
  );

  const rawBody = await c.req.text();

  if (!signature || !timestamp || !rawBody) {
    console.error("Missing signature, timestamp, or raw body");
    throw new Error("Missing required headers or body");
  }

  if (!env.DISCORD_PUBLIC_KEY) {
    throw new Error("Discord bot not configured correctly!");
  }

  const isValidRequest = await verifyKey(
    rawBody,
    signature,
    timestamp,
    env.DISCORD_PUBLIC_KEY,
  );

  logger.debug(`Request validation result: ${isValidRequest}`);

  if (!isValidRequest) {
    throw new HTTPException(401, {
      message: "Invalid signature",
    });
  }

  const interaction: APIInteraction = JSON.parse(rawBody);

  c.set("interaction", interaction);
  c.set("logger", logger);

  await next();
});
