import { Strategy } from "passport-discord";
import env from "../env";
import db from "../drizzle/db";
import { user } from "../drizzle/schema";
import { REST } from "@discordjs/rest";
import { API } from "@discordjs/core";

const discordStrategy = new Strategy(
  {
    clientID: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
    callbackURL: env.DISCORD_CALLBACK_URL,
    scope: ["identify", "guilds", "guilds.members.read"],
  },
  async (accessToken, refreshToken, profile, cb) => {
    if (!profile.guilds) {
      return cb(new Error("No guilds found"), undefined);
    }

    // check if user is in guild
    const validGuild =
      profile.guilds.findIndex((guild) => guild.id === env.GUILD_ID) !== -1;

    if (!validGuild) {
      return cb(new Error("User not in guild"), undefined);
    }

    // Create a discord rest client with the user's access token
    const rest = new REST({ version: "10", authPrefix: "Bearer" }).setToken(
      accessToken
    );

    // Create a discord api client with the rest client
    const api = new API(rest);

    // Get the guild member from the discord api
    const guildMember = await api.users.getGuildMember(env.GUILD_ID)

    // Read the user's nickname from the guild member or fallback to their username
    const nick = guildMember.nick || profile.username;

    // Upsert the user into the database
    const [authedUser] = await db
      .insert(user)
      .values({
        id: profile.id,
        username: nick,
        roles: guildMember.roles,
      })
      .onConflictDoUpdate({
        target: user.id,
        set: {
          username: nick,
          roles: guildMember.roles,
          updatedAt: new Date().toISOString(),
        },
      })
      .returning();

    // Return the user if they were successfully upserted
    if (!authedUser) {
      return cb(new Error("User not found"), undefined);
    }

    return cb(null, authedUser);
  }
);

export default discordStrategy;