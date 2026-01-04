import env from "@/server/env";
import { createFileRoute } from "@tanstack/react-router";
import { setCookie } from "@tanstack/react-start/server";
import { Discord, generateCodeVerifier, generateState } from "arctic";

export const Route = createFileRoute("/api/auth/discord")({
  server: {
    handlers: {
      GET: async () => {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();

        if (
          !env.DISCORD_CLIENT_ID ||
          !env.DISCORD_CLIENT_SECRET ||
          !env.DISCORD_CALLBACK_URL
        ) {
          throw new Error("Login with Discord not configured!");
        }

        const discord = new Discord(
          env.DISCORD_CLIENT_ID,
          env.DISCORD_CLIENT_SECRET,
          env.DISCORD_CALLBACK_URL,
        );

        const url = discord.createAuthorizationURL(state, codeVerifier, [
          "identify",
          "guilds",
          "guilds.members.read",
        ]);

        setCookie("discord_oauth_state", state, {
          secure: import.meta.env.PROD, // set to false in localhost
          path: "/",
          httpOnly: true,
          maxAge: 60 * 10, // 10 minutes
        });
        setCookie("discord_oauth_code_verifier", codeVerifier, {
          secure: import.meta.env.PROD, // set to false in localhost
          path: "/",
          httpOnly: true,
          maxAge: 60 * 10, // 10 minutes
        });

        return Response.redirect(url, 302);
      },
    },
  },
});
