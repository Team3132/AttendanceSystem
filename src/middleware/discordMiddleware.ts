import { reply } from "@/routes/api/-interaction/interactionReply";
import type { ServerContext } from "@/server";
import env from "@/server/env";
import { logger as parentLogger } from "@/utils/logger";
import { EmbedBuilder, codeBlock } from "@discordjs/builders";
import { type APIInteraction, MessageFlags } from "@discordjs/core";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import type { ConsolaInstance } from "consola";
import { verifyKey } from "discord-interactions";

interface ContextReturn {
  logger: ConsolaInstance;
  interaction: APIInteraction;
}

export const discordMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    if (!env.DISCORD_PUBLIC_KEY)
      throw new Error("Discord Public Key not configured");

    const signature = getRequestHeader("X-Signature-Ed25519");
    const timestamp = getRequestHeader("X-Signature-Timestamp");

    /** Child logger for interaction logging (passed to request context) */
    const logger = parentLogger.withTag("Discord");

    const rawBody = await request.text();

    if (!signature || !timestamp || !rawBody) {
      logger.error("Missing signature, timestamp, or raw body");
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
    const start = performance.now();
    try {
      const result = await next({
        context: {
          interaction,
          logger,
        } as ContextReturn & ServerContext,
      });

      return result;
    } catch (error) {
      logger.error(
        `Type ${interaction.type} - ${interaction.user?.username} (${Math.round(performance.now() - start)}ms)`,
        error,
      );

      if (error instanceof Error) {
        return reply({
          content: error.name,
          flags: MessageFlags.Ephemeral,
          embeds: [
            new EmbedBuilder()
              .setTitle(error.name)
              .setDescription(codeBlock(error.message))
              .setColor([255, 0, 0])
              .toJSON(),
          ],
        });
      }

      return reply({
        content: "Unknown Error Occured",
        flags: MessageFlags.Ephemeral,
        embeds: [
          new EmbedBuilder()
            .setTitle("Unknown Error")
            .setDescription(
              codeBlock("An unknown error occured, please message maintainer."),
            )
            .setColor([255, 0, 0])
            .toJSON(),
        ],
      });
    }
  },
);
