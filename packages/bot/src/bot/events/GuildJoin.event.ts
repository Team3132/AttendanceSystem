import { ROLES } from "@/constants";
import {
  EmbedBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  roleMention,
  TextInputBuilder,
  userMention,
} from "@discordjs/builders";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  GuildMember,
  Message,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  TextInputStyle,
} from "discord.js";
import {
  Button,
  type ButtonContext,
  ComponentParam,
  Context,
  Ctx,
  Modal,
  type ModalContext,
  ModalParam,
  On,
  Options,
  SelectedStrings,
  SlashCommand,
  type SlashCommandContext,
  StringSelect,
  type StringSelectContext,
} from "necord";
import { RoleSelectOptions } from "../dto/RoleSelectOptions";

const guildId = process.env.VITE_GUILD_ID;

@Injectable()
export class GuildJoinEvent {
  constructor(
    private readonly client: Client,
    private readonly config: ConfigService,
  ) {}

  @SlashCommand({
    name: "spawnroleselect",
    description: "Spawn a join button for the server.",
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    guilds: guildId ? [guildId] : undefined,
    dmPermission: false,
  })
  public async spawnRoleSelect(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel: adminChannel }: RoleSelectOptions,
  ) {
    // get channel command was executed in

    if (!interaction.guild || !interaction.channel) {
      return interaction.reply({
        content: "This command can only be executed in a guild.",
        ephemeral: true,
      });
    }

    const channel = await interaction.channel?.fetch();

    if (channel.isSendable()) {
      try {
        const rowBuilder =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            GuildJoinEvent.createRoleSelector(adminChannel.id),
          );

        await channel.send({
          content: "Select your role.",
          components: [rowBuilder],
        });
      } catch (_error) {
        console.error(_error);
        return interaction.reply({
          content:
            "Failed to send the role selector. Please check my permissions.",
          ephemeral: true,
        });
      }
    }

    return interaction.reply({
      content: "Role selector sent!",
      ephemeral: true,
    });
  }

  /**
   * Create the role selector for the user to select their role.
   */
  private static createRoleSelector(adminChannelId: string) {
    const roleSelector = new StringSelectMenuBuilder()
      .setCustomId(`access/${adminChannelId}/role_selector`)
      .setPlaceholder("Select a role to join.")
      .setMaxValues(1)
      .setMinValues(1)
      .addOptions([
        {
          value: ROLES.STUDENT,
          label: "Student",
          description: "Student role",
        },
        {
          value: ROLES.PARENT,
          label: "Parent",
          description: "Parent role",
        },
        {
          value: ROLES.MENTOR,
          label: "Mentor",
          description: "Mentor role",
        },
      ]);

    return roleSelector;
  }

  @StringSelect("access/:adminChannel/role_selector")
  public async roleSelector(
    @Context() [interaction]: StringSelectContext,
    @SelectedStrings() values: string[],
    @ComponentParam("adminChannel") adminChannelId: string,
  ) {
    if (!interaction.guild || !interaction.channel) {
      return interaction.reply({
        content: "This command can only be executed in a guild.",
        ephemeral: true,
      });
    }

    const roleId = values[0];

    if (!roleId) {
      return interaction.reply({
        content: "Invalid role selected.",
        ephemeral: true,
      });
    }

    // Create the name input modal for the user to enter their name.
    const nameInputModal = GuildJoinEvent.createNameInput(
      adminChannelId,
      roleId,
    );

    await interaction.showModal(nameInputModal);
  }

  /**
   * Creates a name input modal for the user to enter their name and their children's names if they are a parent.
   * @param roleId The role ID that the user selected.
   * @returns The name input modal.
   */
  private static createNameInput(adminChannelId: string, roleId: string) {
    const isParent = roleId === ROLES.PARENT;

    /**
     * Create the name input for the user to enter their name.
     * Should be their first name and the first letter of their last name.
     */
    const nameInput = new TextInputBuilder()
      .setCustomId("name")
      .setPlaceholder("Enter your name like 'JohnD'")
      .setLabel("Name")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    /**
     * If the role is a parent, we need to ask for the children's names to add their names to the parent's nickname.
     */
    const childNamesInput = new TextInputBuilder()
      .setCustomId("child_names")
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
      .setLabel("Child Names")
      .setPlaceholder(
        "Enter your children's names, separated by commas. Example: 'JackD, JaneD'",
      );

    const actionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        nameInput,
      );

    if (isParent) {
      actionRow.addComponents(childNamesInput);
      console.log("Parent");
    }

    const nameInputModal = new ModalBuilder()
      .setTitle("Name Input")
      .setCustomId(`access/${adminChannelId}/name/${roleId}`)
      .addComponents([actionRow]);

    return nameInputModal;
  }

  @Modal("access/:adminChannel/name/:roleId")
  public async handleNameInput(
    @Ctx() [interaction]: ModalContext,
    @ModalParam("roleId") roleId: string,
    @ModalParam("adminChannel") adminChannelId: string,
  ) {
    if (!interaction.guild || !interaction.channel) {
      return interaction.reply({
        content: "This command can only be executed in a guild.",
        ephemeral: true,
      });
    }

    const nameValue = interaction.fields.getTextInputValue("name");

    if (!nameValue) {
      return interaction.reply({
        content: "Please enter your name.",
        ephemeral: true,
      });
    }

    // Create the user's nickname based on the role they selected.
    const nickname = GuildJoinEvent.createNickname(
      roleId,
      nameValue,
      roleId === ROLES.PARENT
        ? interaction.fields.getTextInputValue("child_names")
        : undefined,
    );

    // Set the user's nickname and send an access request message to the admin channel.
    if (interaction.member && interaction.member instanceof GuildMember) {
      try {
        await interaction.member.setNickname(nickname);
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: "Failed to set your nickname.",
          embeds: [
            new EmbedBuilder().setDescription(
              error instanceof Error ? error.message : "Unknown error",
            ),
          ],
          ephemeral: true,
        });
      }
    }

    const accessRequestMessage = GuildJoinEvent.createAccessRequestMessage(
      interaction.user.id,
      roleId,
    );

    // Get the admin channel
    const adminChannel = await interaction.guild.channels.fetch(adminChannelId);

    if (!adminChannel?.isSendable()) {
      return interaction.reply({
        content:
          "Failed to send the access request message. Please dm a admin member.",
        ephemeral: true,
      });
    }

    // sent an initial message and edit it to avoid ping spam
    try {
      const message = await adminChannel.send({
        content: "Server access request",
      });

      await message.edit(accessRequestMessage);
    } catch (error) {
      await interaction.reply({
        content:
          "Failed to send the access request message. Please dm a admin member.",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: "Access request sent, please wait for admin approval.",
      ephemeral: true,
    });
  }

  /**
   * Create the nickname for the user based on the role they selected and the name they entered.
   * @param roleId The role ID that the user selected.
   * @param name The name the user entered.
   * @param childNames The children's names the user entered.
   * @returns The nickname to set for the user.
   */
  private static createNickname(
    roleId: string,
    name: string,
    childNames?: string,
  ) {
    let nickname = name;

    if (roleId === ROLES.PARENT && childNames) {
      const children = childNames
        .split(",")
        .map((childName) => childName.trim());
      nickname += ` (${children.join(", ")})`;
    }

    return nickname;
  }

  /**
   * Create an access request message to send to the admin channel.
   * It should include the user's ID, the role they selected, and the name they entered (can be a mention based on userId).
   * Should show 2 buttons: Approve and Ignore.
   * @param userId The user requesting access.
   * @param roleId The role the user selected.
   */
  private static createAccessRequestMessage(userId: string, roleId: string) {
    const approveButton = new ButtonBuilder()
      .setCustomId(`approve/${userId}/${roleId}`)
      .setLabel("Approve")
      .setStyle(ButtonStyle.Success);

    const ignoreButton = new ButtonBuilder()
      .setCustomId(`ignore/${userId}/${roleId}`)
      .setLabel("Ignore")
      .setStyle(ButtonStyle.Danger);

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
      approveButton,
      ignoreButton,
    ]);

    return {
      content: `${userMention(userId)} is requesting access to the server as a ${roleMention(roleId)}.`,
      components: [actionRow],
    };
  }

  @Button("approve/:userId/:roleId")
  public async approveRequest(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("userId") userId: string,
    @ComponentParam("roleId") roleId: string,
  ) {
    if (!interaction.guild || !interaction.channel) {
      return interaction.reply({
        content: "This command can only be executed in a guild.",
        ephemeral: true,
      });
    }

    const member = await interaction.guild.members.fetch(userId);

    if (!member) {
      return interaction.reply({
        content: "Failed to fetch the user.",
        ephemeral: true,
      });
    }

    const role = interaction.guild.roles.cache.find(
      (role) => role.id === roleId,
    );

    if (!role) {
      return interaction.reply({
        content: "Failed to fetch the role.",
        ephemeral: true,
      });
    }

    await member.roles.add(role);

    return interaction.reply({
      content: "Access request approved!",
      ephemeral: true,
    });
  }
}
