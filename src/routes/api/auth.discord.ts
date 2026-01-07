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
          !env.VITE_URL
        ) {
          throw new Error("Login with Discord not configured!");
        }

        const callbackUrl = new URL(env.VITE_URL);

        callbackUrl.pathname = "/api/auth/discord/callback";

        const deepCallbackUrl = new URL(env.VITE_URL);

        deepCallbackUrl.pathname = "/api/auth/discord/deep-callback";

        const discord = new Discord(
          env.DISCORD_CLIENT_ID,
          env.DISCORD_CLIENT_SECRET,
          isMobile ? deepCallbackUrl.toString() : callbackUrl.toString(),
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
