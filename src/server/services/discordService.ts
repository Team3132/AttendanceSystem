import { trytm } from "@/utils/trytm";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  API,
  ChannelType,
  InteractionContextType,
  PermissionFlagsBits,
} from "@discordjs/core";
import { REST } from "@discordjs/rest";
import env from "../env";
import { ServerError } from "../utils/errors";

/**
 * Get the API instance for the bot
 * @returns The API instance for the bot
 */
export const getDiscordBotAPI = () => {
  const rest = new REST({ version: "10", authPrefix: "Bot" }).setToken(
    env.DISCORD_TOKEN,
  );

  const api = new API(rest);

  return api;
};

/**
 * Get the roles of a guild the user is in
 * @param userId The ID of the current user
 */
export const getServerRoles = async () => {
  const guildId = env.GUILD_ID;
  const api = await getDiscordBotAPI();

  const [guildRoles, rolesFetchError] = await trytm(
    api.guilds.getRoles(guildId),
  );

  if (rolesFetchError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching roles",
      cause: rolesFetchError,
    });
  }

  // return in name, id format
  return guildRoles.map(({ name, id }) => ({ name, id }));
};

/**
 * Get the channels of a guild the user is in
 * @param userId The ID of the current user
 * @returns The channels of the guild
 */
export const getServerChannels = async () => {
  const guildId = env.GUILD_ID;
  const api = await getDiscordBotAPI();

  const [channels, channelFetchError] = await trytm(
    api.guilds.getChannels(guildId),
  );

  if (channelFetchError) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error fetching channels",
      cause: channelFetchError,
    });
  }

  const textChannels = channels.filter(
    (channel) => channel.type === ChannelType.GuildText,
  );

  // return in name, id format
  return textChannels.map(({ name, id }) => ({ name, id }));
};

export async function deployCommands() {
  const rest = new REST().setToken(env.DISCORD_TOKEN);

  const api = new API(rest);

  const [data, err] = await trytm(
    api.applicationCommands.bulkOverwriteGuildCommands(
      env.DISCORD_CLIENT_ID,
      env.GUILD_ID,
      [
        new SlashCommandBuilder()
          .setName("syncplz")
          .setDescription(
            "Send a humble request to the bot to sync the calendar.",
          )
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
          .setContexts(InteractionContextType.Guild)
          .toJSON(),
        new SlashCommandBuilder()
          .setName("ping")
          .setDescription("Ping the bot to check if it's online.")
          .toJSON(),
        new SlashCommandBuilder()
          .setName("requestrsvp")
          .setDescription(
            "Send a message for people to RSVP to a specific event.",
          )
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
          .setContexts(InteractionContextType.Guild)
          .addStringOption((option) =>
            option
              .setAutocomplete(true)
              .setName("meeting")
              .setDescription("The event to RSVP to")
              .setRequired(true),
          )
          .toJSON(),
        new SlashCommandBuilder()
          .setName("leaderboard")
          .setDescription("Get the leaderboard for outreach hours")
          .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
          .setContexts(InteractionContextType.Guild)
          .toJSON(),
      ],
    ),
  );

  if (err) {
    throw new ServerError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deploying commands",
      cause: err,
    });
  }
  console.log("Successfully deployed commands:", data);

  return;
}
