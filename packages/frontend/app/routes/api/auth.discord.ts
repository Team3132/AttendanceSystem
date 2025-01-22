import { discord } from "@/server/auth/lucia";
import { createAPIFileRoute } from "@tanstack/start/api";
import { generateState } from "arctic";
import { setCookie } from "vinxi/http";

export const APIRoute = createAPIFileRoute("/api/auth/discord")({
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

    return new Response(null, {
      status: 302,
      headers: {
        location: url.toString(),
      },
    });
  },
});
