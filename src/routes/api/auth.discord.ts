import { discord } from "@/server/auth/lucia";
import { consola } from "@/server/logger";
import { createFileRoute } from "@tanstack/react-router";
import { setResponseHeader } from "@tanstack/react-start/server";
import { generateCodeVerifier, generateState } from "arctic";
import { Cookie } from "lucia";

export const Route = createFileRoute("/api/auth/discord")({
  server: {
    handlers: {
      GET: async () => {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const url = await discord.createAuthorizationURL(state, codeVerifier, [
          "identify",
          "guilds",
          "guilds.members.read",
        ]);

        const stateCookie = new Cookie("discord_oauth_state", state, {
          secure: import.meta.env.PROD, // set to false in localhost
          path: "/",
          httpOnly: true,
          maxAge: 60 * 10, // 10 minutes
        });
        const codeVerifierCookie = new Cookie(
          "discord_oauth_code_verifier",
          codeVerifier,
          {
            secure: import.meta.env.PROD, // set to false in localhost
            path: "/",
            httpOnly: true,
            maxAge: 60 * 10, // 10 minutes
          },
        );
        setResponseHeader("Set-Cookie", [
          stateCookie.serialize(),
          codeVerifierCookie.serialize(),
        ]);
        consola.info("Redirecting to Discord OAuth");
        return new Response(null, {
          status: 302,
          headers: {
            location: url.toString(),
          },
        });
      },
    },
  },
});
