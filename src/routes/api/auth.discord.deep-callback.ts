import { userTable } from "@/server/drizzle/schema";
import env from "@/server/env";
import { consola } from "@/server/logger";
import type { ColumnNames } from "@/server/utils/db/ColumnNames";
import { buildConflictUpdateColumns } from "@/server/utils/db/buildConflictUpdateColumns";
import { buildSetWhereColumns } from "@/server/utils/db/buildSetWhereColumns";
import { trytm } from "@/utils/trytm";
import { API } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import { createFileRoute } from "@tanstack/react-router";
import { deleteCookie, getCookie } from "@tanstack/react-start/server";
import { Discord } from "arctic";
import { z } from "zod";

const querySchema = z.object({
  code: z.string(),
  state: z.string(),
});

export const Route = createFileRoute("/api/auth/discord/deep-callback")({
  server: {
    handlers: {
      GET: async ({ context, request }) => {
        const { db, lucia } = context;

        const headers = new Headers();

        headers.set("Location", env.VITE_URL);

        const safeQuery = await querySchema.safeParseAsync(
          Object.fromEntries(new URL(request.url).searchParams.entries()),
        );

        if (!safeQuery.success)
          throw new Error("Missing query params, retry request.");

        const { code, state } = safeQuery.data;

        if (
          !env.DISCORD_CLIENT_ID ||
          !env.DISCORD_CLIENT_SECRET ||
          !env.VITE_URL
        ) {
          throw new Error("Login with Discord not configured!");
        }

        const callbackUrl = new URL(env.VITE_URL);

        callbackUrl.pathname = "/api/auth/discord/deep-callback";

        const discord = new Discord(
          env.DISCORD_CLIENT_ID,
          env.DISCORD_CLIENT_SECRET,
          callbackUrl.toString(),
        );

        const discord_oauth_state = getCookie("discord_oauth_state");
        const discord_oauth_code_verifier = getCookie(
          "discord_oauth_code_verifier",
        );

        if (!discord_oauth_code_verifier || !discord_oauth_state)
          throw new Error("No state cookies supplied, retry request.");

        deleteCookie("discord_oauth_state");
        deleteCookie("discord_oauth_code_verifier");

        if (discord_oauth_state !== state) {
          return new Response(null, {
            headers,
            status: 302,
          });
        }

        const [tokens, tokensError] = await trytm(
          discord.validateAuthorizationCode(code, discord_oauth_code_verifier),
        );

        if (tokensError) {
          consola.error("Failed to validate authorization code", tokensError);
          return new Response(null, {
            headers,
            status: 302,
          });
        }

        const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(
          tokens.accessToken(),
        );

        const api = new API(rest);

        const [discordUserGuilds, guildsError] = await trytm(
          api.users.getGuilds(),
        );
        if (guildsError) {
          consola.error("Failed to fetch user guilds", guildsError);
          return new Response(null, {
            headers,
            status: 302,
          });
        }

        const validGuild =
          discordUserGuilds.findIndex((guild) => guild.id === env.GUILD_ID) !==
          -1;

        if (!validGuild) {
          consola.error(
            "User is not a member of the required guild",
            env.GUILD_ID,
          );
          return new Response(null, {
            headers,
            status: 302,
          });
        }

        const [meData, meError] = await trytm(api.users.get("@me"));

        if (meError) {
          consola.error("Failed to fetch user data", meError);
          return new Response(null, {
            headers,
            status: 302,
          });
        }
        const { id, username } = meData;

        const [guildMemberData, guildMemberError] = await trytm(
          api.users.getGuildMember(env.GUILD_ID),
        );
        if (guildMemberError) {
          consola.error("Failed to fetch guild member data", guildMemberError);
          return new Response(null, {
            headers,
            status: 302,
          });
        }
        const { roles, nick } = guildMemberData;

        const updateColumns: ColumnNames<typeof userTable>[] = [
          "accessToken",
          "roles",
          "refreshToken",
          "accessTokenExpiresAt",
          "username",
        ];

        const [_authedUserData, userUpdateError] = await trytm(
          db
            .insert(userTable)
            .values({
              id,
              username: nick || username,
              roles: roles,
              accessToken: tokens.accessToken(),
              refreshToken: tokens.refreshToken(),
              accessTokenExpiresAt: tokens.accessTokenExpiresAt(),
            })
            .onConflictDoUpdate({
              target: userTable.id,
              set: buildConflictUpdateColumns(userTable, updateColumns),
              setWhere: buildSetWhereColumns(userTable, updateColumns),
            })
            .returning(),
        );

        if (userUpdateError) {
          consola.error(
            "Failed to update or insert user data",
            userUpdateError,
          );
          return new Response(null, {
            headers,
            status: 302,
          });
        }

        const [session, sessionError] = await trytm(
          lucia.createSession(id, {}),
        );

        if (sessionError) {
          consola.error("Failed to create session", sessionError);
          return new Response(null, {
            headers,
            status: 302,
          });
        }

        consola
          .withTag("auth")
          .info(`User ${nick || username} (${id}) authenticated successfully`);

        const url = new URL(env.DEEPLINK_LOGIN_CALLBACK);

        url.searchParams.set("sessionId", session.id);

        headers.set("Location", url.toString());

        return new Response(null, {
          headers,
          status: 302,
        });
      },
    },
  },
});
