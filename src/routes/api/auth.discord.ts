import { discord } from "@/server/auth/lucia";
import { consola } from "@/server/logger";
import { setCookie } from "@tanstack/react-start/server";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { generateState } from "arctic";

export const ServerRoute = createServerFileRoute("/api/auth/discord").methods({
  GET: async () => {
    const state = generateState();
    const url = await discord.createAuthorizationURL(state, {
      scopes: ["identify", "guilds", "guilds.members.read"],
    });

    setCookie("discord_oauth_state", state, {
      path: "/",
      secure: import.meta.env.PROD,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });
    consola.info("Redirecting to Discord OAuth");
    return new Response(null, {
      status: 302,
      headers: {
        location: url.toString(),
      },
    });
  },
});
