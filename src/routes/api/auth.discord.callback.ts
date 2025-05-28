import { discord, lucia } from "@/server/auth/lucia";
import db from "@/server/drizzle/db";
import { userTable } from "@/server/drizzle/schema";
import env from "@/server/env";
import { consola } from "@/server/logger";
import type { ColumnNames } from "@/server/utils/db/ColumnNames";
import { buildConflictUpdateColumns } from "@/server/utils/db/buildConflictUpdateColumns";
import { buildSetWhereColumns } from "@/server/utils/db/buildSetWhereColumns";
import { trytm } from "@/utils/trytm";
import { API } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { z } from "zod";

export const ServerRoute = createServerFileRoute().methods({
  GET: async ({ request }) => {
    // request url
    const url = new URL(request.url);
    // query parameters
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const parsedQuery = await z
      .object({
        code: z.string(),
        state: z.string(),
      })
      .safeParseAsync(queryParams);

    if (!parsedQuery.success) {
      consola.error("Invalid query parameters", parsedQuery.error);
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }

    const { code, state } = parsedQuery.data;

    const discordState = getCookie("discord_oauth_state");

    if (discordState !== state) {
      consola.error("State mismatch", {
        expected: discordState,
        received: state,
      });
      deleteCookie("discord_oauth_state");
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }

    deleteCookie("discord_oauth_state");

    const [tokens, tokensError] = await trytm(
      discord.validateAuthorizationCode(code),
    );
    if (tokensError) {
      consola.error("Failed to validate authorization code", tokensError);
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }

    const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(
      tokens.accessToken,
    );
    const api = new API(rest);

    const [discordUserGuilds, guildsError] = await trytm(api.users.getGuilds());
    if (guildsError) {
      consola.error("Failed to fetch user guilds", guildsError);
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }

    const validGuild =
      discordUserGuilds.findIndex((guild) => guild.id === env.VITE_GUILD_ID) !==
      -1;

    if (!validGuild) {
      consola.error(
        "User is not a member of the required guild",
        env.VITE_GUILD_ID,
      );
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }

    const [meData, meError] = await trytm(api.users.get("@me"));

    if (meError) {
      consola.error("Failed to fetch user data", meError);
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }
    const { id, username } = meData;

    const [guildMemberData, guildMemberError] = await trytm(
      api.users.getGuildMember(env.VITE_GUILD_ID),
    );
    if (guildMemberError) {
      consola.error("Failed to fetch guild member data", guildMemberError);
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }
    const { roles, nick } = guildMemberData;

    const { accessToken, refreshToken, accessTokenExpiresAt } = tokens;

    const updateColumns: ColumnNames<typeof userTable>[] = [
      "accessToken",
      "roles",
      "refreshToken",
      "accessTokenExpiresAt",
      "username",
    ];

    const [authedUserData, userUpdateError] = await trytm(
      db
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
        .returning(),
    );

    if (userUpdateError) {
      consola.error("Failed to update or insert user data", userUpdateError);
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }

    const [authedUser] = authedUserData;

    if (!authedUser) {
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }

    const [session, sessionError] = await trytm(lucia.createSession(id, {}));

    if (sessionError) {
      consola.error("Failed to create session", sessionError);
      return new Response(null, {
        status: 302,
        headers: {
          location: env.VITE_FRONTEND_URL,
        },
      });
    }

    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    consola
      .withTag("auth")
      .info(
        `User ${authedUser.username} (${authedUser.id}) authenticated successfully.`,
      );

    return new Response(null, {
      status: 302,
      headers: {
        location: env.VITE_FRONTEND_URL,
      },
    });
  },
});
