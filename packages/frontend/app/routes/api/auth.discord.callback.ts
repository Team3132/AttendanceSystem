import { discord, lucia } from "@/server/auth/lucia";
import db from "@/server/drizzle/db";
import { userTable } from "@/server/drizzle/schema";
import env from "@/server/env";
import mainLogger from "@/server/logger";
import { API } from "@discordjs/core";
import { DiscordAPIError, REST } from "@discordjs/rest";
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

      const { id, username } = await api.users.get("@me");

      const { nick, roles } = await api.users.getGuildMember(env.VITE_GUILD_ID);

      const { accessToken, refreshToken, accessTokenExpiresAt } = tokens;

      const [authedUser] = await db
        .insert(userTable)
        .values({
          id,
          username: nick || username,
          roles: roles,
          accessToken,
          refreshToken,
          accessTokenExpiresAt,
        })
        .onConflictDoUpdate({
          target: userTable.id,
          set: {
            username: nick || username,
            roles: roles,
            updatedAt: new Date().toISOString(),
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
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

      const session = await lucia.createSession(id, {});

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
