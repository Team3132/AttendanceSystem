import { API, ChannelType } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import env from "../env";

/**
 * Get the API instance for the bot
 * @returns The API instance for the bot
 */
export const getDiscordBotAPI = () => {
  const rest = new REST({ version: "10", authPrefix: "Bot" }).setToken(
    env.VITE_DISCORD_TOKEN,
  );

  const api = new API(rest);

  return api;
};

/**
 * Get the roles of a guild the user is in
 * @param userId The ID of the current user
 */
export const getServerRoles = async () => {
  const guildId = env.VITE_GUILD_ID;
  const api = await getDiscordBotAPI();

  const guild = await api.guilds.getRoles(guildId);

  // return in name, id format
  return guild.map(({ name, id }) => ({ name, id }));
};

/**
 * Get the channels of a guild the user is in
 * @param userId The ID of the current user
 * @returns The channels of the guild
 */
export const getServerChannels = async () => {
  const guildId = env.VITE_GUILD_ID;
  const api = await getDiscordBotAPI();

  const guild = await api.guilds.getChannels(guildId);

  const textChannels = guild.filter(
    (channel) => channel.type === ChannelType.GuildText,
  );

  // return in name, id format
  return textChannels.map(({ name, id }) => ({ name, id }));
};
