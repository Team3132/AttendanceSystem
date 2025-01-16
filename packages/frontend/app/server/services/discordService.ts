import { API } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import env from "../env";
import db from "../drizzle/db";
import { userTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Get the API instance for the current user
 * 
 * If the access token is expired, it will be refreshed
 * 
 * @param userId The ID of the user to get the API instance for
 * @returns An API instance for the user
 */
const getDiscordAPI = async (userId: string) => {
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.id, userId),
    })

    if (!user) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
        })
    }
    

    const { accessToken, refreshToken, accessTokenExpiresAt } = user;

    if (!accessToken || !refreshToken || !accessTokenExpiresAt) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User does not have tokens, must login at least once to web app",
        })
    }

    if (accessTokenExpiresAt > new Date()) {
        const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(accessToken);

        const api = new API(rest);

        return api
    }

    // If the access token is expired, refresh it
    const refreshREST = new REST({ version: "10", authPrefix: "Bearer" });
    const refreshAPI = new API(refreshREST);

    const refreshTokenResponse = await refreshAPI.oauth2.refreshToken({
        client_id: env.VITE_DISCORD_CLIENT_ID,
        client_secret: env.VITE_DISCORD_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    })

    // update database with new tokens
    const [newUser] = await db.update(userTable).set({
        accessToken: refreshTokenResponse.access_token,
        refreshToken: refreshTokenResponse.refresh_token,
        accessTokenExpiresAt: new Date(Date.now() + refreshTokenResponse.expires_in * 1000),
    }).where(eq(userTable.id, userId)).returning();

    if (!newUser) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update user tokens",
        })
    }

    const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(refreshTokenResponse.access_token);

    const api = new API(rest);

    return api
}

/**
 * Get the roles of a guild the user is in
 * @param userId The ID of the current user
 */
export const getServerRoles = async (userId: string) => {
    const guildId = env.VITE_GUILD_ID;
    const api = await getDiscordAPI(userId);   

    const guild = await api.guilds.getRoles(guildId);

    // return in name, id format
    return guild.map(({ name, id }) => ({ name, id }));
}

/**
 * Get the channels of a guild the user is in
 * @param userId The ID of the current user
 * @returns The channels of the guild
 */
export const getServerChannels = async (userId: string) => {
    const guildId = env.VITE_GUILD_ID;
    const api = await getDiscordAPI(userId);

    const guild = await api.guilds.getChannels(guildId);

    // return in name, id format
    return guild.map(({ name, id }) => ({ name, id }));
}