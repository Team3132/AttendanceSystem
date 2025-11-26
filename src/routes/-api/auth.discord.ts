import { discord } from "@/server/auth/lucia";
import { consola } from "@/server/logger";
import { generateCodeVerifier, generateState } from "arctic";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";

export const authDiscord = new Hono().get("/", async (c) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
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
