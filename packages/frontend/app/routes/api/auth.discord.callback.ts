import { discord, lucia } from "@/api/auth/lucia";
import db from "@/api/drizzle/db";
import { userTable } from "@/api/drizzle/schema";
import env from "@/api/env";
import mainLogger from "@/api/logger";
import { API } from "@discordjs/core";
import { DiscordAPIError, REST } from "@discordjs/rest";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { OAuth2RequestError } from "arctic";
import {
  deleteCookie,
  getCookie,
  getValidatedQuery,
  setCookie,
} from "vinxi/http";
import { z } from "zod";

export const APIRoute = createAPIFileRoute("/api/auth/discord/callback")({
  GET: async () => {
    const { code, state } = await getValidatedQuery(
      z.object({
        code: z.string(),
        state: z.string(),
      }).parse,
    );

    const discordState = getCookie("discord_oauth_state");

    if (discordState !== state) {
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }

    deleteCookie("discord_oauth_state");

    try {
      const tokens = await discord.validateAuthorizationCode(code);

      const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(
        tokens.accessToken,
      );
      const api = new API(rest);

      const discordUserGuilds = await api.users.getGuilds();

      const validGuild =
        discordUserGuilds.findIndex(
          (guild) => guild.id === env.VITE_GUILD_ID,
        ) !== -1;

      if (!validGuild) {
        return new Response(null, {
          status: 302,
          headers: {
            location: env.VITE_FRONTEND_URL,
          },
        });
      }

      const discordUser = await api.users.get("@me");

      const guildMember = await api.users.getGuildMember(env.VITE_GUILD_ID);

      const [authedUser] = await db
        .insert(userTable)
        .values({
          id: discordUser.id,
          username: guildMember.nick || discordUser.username,
          roles: guildMember.roles,
        })
        .onConflictDoUpdate({
          target: userTable.id,
          set: {
            username: guildMember.nick || discordUser.username,
            roles: guildMember.roles,
            updatedAt: new Date().toISOString(),
          },
        })
        .returning();

      if (!authedUser) {
        return new Response(null, {
          status: 302,
          headers: {
            location: env.VITE_FRONTEND_URL,
          },
        });
      }

      const session = await lucia.createSession(discordUser.id, {});

      const sessionCookie = lucia.createSessionCookie(session.id);
      setCookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    } catch (error) {
      if (error instanceof OAuth2RequestError) {
        mainLogger.error(error);
      } else if (error instanceof DiscordAPIError) {
        mainLogger.error(error);
      } else if (error instanceof Error) {
        mainLogger.error(error);
      } else {
        mainLogger.error("Unknown error", error);
      }

      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }
  },
});
