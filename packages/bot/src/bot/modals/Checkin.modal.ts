import { BACKEND_TOKEN, BackendClient } from "@/backend/backend.module";
import {
  ActionRowBuilder,
  type ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { GuildMember, TextInputStyle } from "discord.js";
import { Ctx, Modal, ModalContext, ModalParam } from "necord";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";

@Injectable()
export class CheckinModal {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {}

  @UseGuards(GuildMemberGuard)
  @Modal("event/:eventId/checkin")
  public async onCheckinModal(
    @Ctx() [interaction]: ModalContext,
    @ModalParam("eventId") eventId: string,
  ) {
    const code = interaction.fields.getTextInputValue("code");

    const userId = interaction.user.id;

    const fetchedEvent =
      await this.backendClient.client.bot.getEventDetails.query(eventId);

    if (!fetchedEvent) {
      return interaction.reply({
        ephemeral: true,
        content: "This meeting doesn't exist.",
      });
    }

    const { secret } =
      await this.backendClient.client.bot.getEventSecret.query(eventId);

    if (secret !== code) {
      return interaction.reply({
        ephemeral: true,
        content: "Invalid code.",
      });
    }

    const interactionUser = interaction.member;

    if (!(interactionUser instanceof GuildMember)) {
      return interaction.reply("Not a guild member");
    }

    const userRoles = [
      ...interactionUser.roles.cache.mapValues((role) => role.id).values(),
    ];

    const fetchedUser = await interactionUser.fetch();

    const username = fetchedUser.nickname ?? fetchedUser.user.username;

    await this.backendClient.client.bot.findOrCreateUser.mutate({
      id: userId,
      username,
      roles: userRoles,
    });

    await this.backendClient.client.bot.selfCheckin.mutate({
      eventId,
      userId,
      secret,
    });

    return interaction.reply({
      ephemeral: true,
      content: "You have checked in",
    });
  }

  /**
   * Builds a checkin modal
   * @param eventId The event ID to checkin for
   * @returns A modal builder for the checkin modal
   */
  public static build(eventId: string) {
    return new ModalBuilder()
      .setTitle("Checkin")
      .setCustomId(`event/${eventId}/checkin`)
      .setComponents([
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
          new TextInputBuilder()
            .setCustomId("code")
            .setPlaceholder("8 digit code")
            .setRequired(true)
            .setMinLength(8)
            .setMaxLength(8)
            .setLabel("The event code")
            .setStyle(TextInputStyle.Short),
        ]),
      ]);
  }
}
