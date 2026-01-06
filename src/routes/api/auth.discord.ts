import env from "@/server/env";
import { createFileRoute } from "@tanstack/react-router";
import { Discord, generateCodeVerifier, generateState } from "arctic";
import { serialize } from "cookie-es";

export const Route = createFileRoute("/api/auth/discord")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const isMobile =
          new URL(request.url).searchParams.get("isMobile") === "true";

        console.log("isMobile", isMobile);

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
          isMobile ? env.DISCORD_DEEP_CALLBACK_URL : env.DISCORD_CALLBACK_URL,
        );

        const url = discord.createAuthorizationURL(state, codeVerifier, [
          "identify",
          "guilds",
          "guilds.members.read",
        ]);

        const headers = new Headers();

        headers.append(
          "Set-Cookie",
          serialize("discord_oauth_state", state, {
            secure: import.meta.env.PROD, // set to false in localhost
            path: "/",
            httpOnly: true,
            maxAge: 60 * 10, // 10 minutes
          }),
        );

        headers.append(
          "Set-Cookie",
          serialize("discord_oauth_code_verifier", codeVerifier, {
            secure: import.meta.env.PROD, // set to false in localhost
            path: "/",
            httpOnly: true,
            maxAge: 60 * 10, // 10 minutes
          }),
        );

        headers.append("Location", url.toString());

        return new Response(null, { headers, status: 302 });
      },
    },
  },
});
