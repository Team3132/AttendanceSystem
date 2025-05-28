import { discord, lucia } from "@/server/auth/lucia";
import db from "@/server/drizzle/db";
import { userTable } from "@/server/drizzle/schema";
import env from "@/server/env";
import { consola } from "@/server/logger";
import type { ColumnNames } from "@/server/utils/db/ColumnNames";
import { buildConflictUpdateColumns } from "@/server/utils/db/buildConflictUpdateColumns";
import { buildSetWhereColumns } from "@/server/utils/db/buildSetWhereColumns";
import { API } from "@discordjs/core";
import { DiscordAPIError, REST } from "@discordjs/rest";
import {
  deleteCookie,
  getCookie,
  getValidatedQuery,
  setCookie,
} from "@tanstack/react-start/server";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { OAuth2RequestError } from "arctic";
import { z } from "zod";

export const ServerRoute = createServerFileRoute().methods({
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

      const updateColumns: ColumnNames<typeof userTable>[] = [
        "accessToken",
        "roles",
        "refreshToken",
        "accessTokenExpiresAt",
        "username",
      ];

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
          set: buildConflictUpdateColumns(userTable, updateColumns),
          setWhere: buildSetWhereColumns(userTable, updateColumns),
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
        consola.error(error);
      } else if (error instanceof DiscordAPIError) {
        consola.error(error);
      } else if (error instanceof Error) {
        consola.error(error);
      } else {
        consola.error("Unknown error", error);
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
