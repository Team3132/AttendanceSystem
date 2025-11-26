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
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { z } from "zod";

const querySchema = z.object({
  code: z.string(),
  state: z.string(),
});

const cookieSchema = z.object({
  discord_oauth_state: z.string(),
  discord_oauth_code_verifier: z.string(),
});

export const authDiscordCallback = new Hono().get(
  "/",
  zValidator("query", querySchema),
  zValidator("cookie", cookieSchema),
  async (c) => {
    const { discord_oauth_state, discord_oauth_code_verifier } =
      c.req.valid("cookie");
    const { code, state } = c.req.valid("query");

    deleteCookie(c, "discord_oauth_state");
    deleteCookie(c, "discord_oauth_code_verifier");

    if (discord_oauth_state !== state) {
      return c.redirect(env.VITE_FRONTEND_URL, 302);
    }

    const [tokens, tokensError] = await trytm(
      discord.validateAuthorizationCode(code, discord_oauth_code_verifier),
    );

    if (tokensError) {
      consola.error("Failed to validate authorization code", tokensError);
      return c.redirect(env.VITE_FRONTEND_URL, 302);
    }

    const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(
      tokens.accessToken(),
    );

    const api = new API(rest);

    const [discordUserGuilds, guildsError] = await trytm(api.users.getGuilds());
    if (guildsError) {
      consola.error("Failed to fetch user guilds", guildsError);
      return c.redirect(env.VITE_FRONTEND_URL, 302);
    }

    const validGuild =
      discordUserGuilds.findIndex((guild) => guild.id === env.GUILD_ID) !== -1;

    if (!validGuild) {
      consola.error("User is not a member of the required guild", env.GUILD_ID);
      return c.redirect(env.VITE_FRONTEND_URL, 302);
    }

    const [meData, meError] = await trytm(api.users.get("@me"));

    if (meError) {
      consola.error("Failed to fetch user data", meError);
      return c.redirect(env.VITE_FRONTEND_URL, 302);
    }
    const { id, username } = meData;

    const [guildMemberData, guildMemberError] = await trytm(
      api.users.getGuildMember(env.GUILD_ID),
    );
    if (guildMemberError) {
      consola.error("Failed to fetch guild member data", guildMemberError);
      return c.redirect(env.VITE_FRONTEND_URL, 302);
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
      consola.error("Failed to update or insert user data", userUpdateError);
      return c.redirect(env.VITE_FRONTEND_URL, 302);
    }

    const [session, sessionError] = await trytm(lucia.createSession(id, {}));

    if (sessionError) {
      consola.error("Failed to create session", sessionError);
      return c.redirect(env.VITE_FRONTEND_URL, 302);
    }

    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    consola
      .withTag("auth")
      .info(`User ${nick || username} (${id}) authenticated successfully`);

    return c.redirect(env.VITE_FRONTEND_URL, 302);
  },
);
