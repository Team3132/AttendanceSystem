import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import { Discord, generateCodeVerifier, generateState } from "arctic";
import z from "zod";
import env from "../env";

export const generateRedirect = createServerFn({
  method: "POST",
})
  .inputValidator(
    z.object({
      isMobile: z.boolean().default(false).describe("isMobile"),
    }),
  )
  .handler(async ({ data }) => {
    const { isMobile } = data;
    console.log("generate redirect called");
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    if (
      !env.DISCORD_CLIENT_ID ||
      !env.DISCORD_CLIENT_SECRET ||
      !env.DISCORD_CALLBACK_URL
    ) {
      throw new Error("Login with Discord not configured!");
    }

    if (isMobile && !env.DISCORD_MOBILE_CALLBACK_URL) {
      throw new Error("Mobile redirect not configured");
    }

    const discord = new Discord(
      env.DISCORD_CLIENT_ID,
      env.DISCORD_CLIENT_SECRET,
      isMobile ? env.DISCORD_MOBILE_CALLBACK_URL : env.DISCORD_CALLBACK_URL,
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

    if (!isMobile)
      throw redirect({
        href: url.toString(),
      });

    return { url: url.toString() };
  });
