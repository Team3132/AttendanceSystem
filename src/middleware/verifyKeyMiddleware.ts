import env from "@/server/env";
import { logger as parentLogger } from "@/utils/logger";
import type { APIInteraction } from "@discordjs/core";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { verifyKey } from "discord-interactions";

export const discordMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    if (!env.DISCORD_PUBLIC_KEY)
      throw new Error("Discord Public Key not configured");

    const signature = getRequestHeader("X-Signature-Ed25519");
    const timestamp = getRequestHeader("X-Signature-Timestamp");

    /** Child logger for interaction logging (passed to request context) */
    const logger = parentLogger.withTag("interaction");

    const rawBody = await request.text();

    if (!signature || !timestamp || !rawBody) {
      console.error("Missing signature, timestamp, or raw body");
      throw new Error("Missing required headers or body");
    }

    const isValidRequest = await verifyKey(
      rawBody,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY,
    );

    if (!isValidRequest) {
      throw new Error("Invalid request signature");
    }

    const interaction: APIInteraction = JSON.parse(rawBody);

    return next({
      context: {
        interaction,
        logger,
      },
    });
  },
);
