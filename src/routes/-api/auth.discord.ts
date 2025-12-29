import env from "@/server/env";
import { consola } from "@/server/logger";
import { Discord, generateCodeVerifier, generateState } from "arctic";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import type { HonoEnv } from "../api.$";

export const authDiscord = new Hono<HonoEnv>().get("/", async (c) => {
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

  const url = await discord.createAuthorizationURL(state, codeVerifier, [
    "identify",
    "guilds",
    "guilds.members.read",
  ]);

  setCookie(c, "discord_oauth_state", state, {
    secure: import.meta.env.PROD, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
  });
  setCookie(c, "discord_oauth_code_verifier", codeVerifier, {
    secure: import.meta.env.PROD, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
  });

  consola.info("Redirecting to Discord OAuth");
  return c.redirect(url.toString(), 302);
});
