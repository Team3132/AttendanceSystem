import { GuildChannel } from "discord.js";
import { ChannelOption } from "necord";

export class RoleSelectOptions {
  @ChannelOption({
    name: "channel",
    description: "The channel to send access request messages to",
    required: true,
  })
  channel: GuildChannel;
}
