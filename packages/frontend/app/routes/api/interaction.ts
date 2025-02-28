import env from "@/server/env";
import {
  type APIInteraction,
  type APIInteractionResponsePong,
  InteractionResponseType,
  InteractionType,
} from "@discordjs/core";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getHeader, readRawBody } from "@tanstack/react-start/server";

import { verifyKey } from "discord-interactions";

export const APIRoute = createAPIFileRoute("/api/interaction")({
  GET: async ({ request }) => {
    const signature = getHeader("X-Signature-Ed25519");
    const timestamp = getHeader("X-Signature-Timestamp");

    const rawBody = await readRawBody();

    if (!signature || !timestamp || !rawBody) {
      return json({ message: "Invalid request" }, { status: 401 });
    }

    const isValidRequest = await verifyKey(
      rawBody,
      signature,
      timestamp,
      env.VITE_DISCORD_CLIENT_ID,
    );

    if (!isValidRequest) {
      return new Response("Bad request signature", {
        status: 401,
      });
    }

    const interaction: APIInteraction = await request.json();

    switch (interaction.type) {
      case InteractionType.Ping: {
        return json<APIInteractionResponsePong>({
          type: InteractionResponseType.Pong,
        });
      }

      default: {
        throw new Error("Unhandled interaction type");
      }
    }
  },
});
