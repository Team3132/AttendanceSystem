import { BACKEND_TOKEN, type BackendClient } from "@/backend/backend.module";
import {
  ActionRowBuilder,
  type ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TextInputStyle } from "discord.js";
import { Ctx, Modal, type ModalContext, ModalParam } from "necord";
import { z } from "zod";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";

@Injectable()
export class DelayModal {
  constructor(
    private readonly config: ConfigService,
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {}

  @UseGuards(GuildMemberGuard)
  @Modal("event/:eventId/delay")
  public async onDelayModal(
    @Ctx() [interaction]: ModalContext,
    @ModalParam("eventId") eventId: string,
  ) {
    const delay = interaction.fields.getTextInputValue("delay");

    const value = await z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .safeParseAsync(delay);

    if (!value.success) {
      return interaction.reply({
        content: "Please enter a valid number in minutes (no decimals)",
        ephemeral: true,
      });
    }

    const userId = interaction.user.id;

    await this.backendClient.client.bot.setEventRsvp.mutate({
      eventId,
      userId,
      status: "LATE",
      delay: value.data,
    });

    const reminderMessage =
      await this.backendClient.client.bot.getEventReminder.query(eventId);

    if (interaction.isFromMessage()) {
      return interaction.update({
        content: reminderMessage.content,
        components: reminderMessage.components,
        embeds: reminderMessage.embeds,
      });
    }
    return interaction.reply({
      ephemeral: true,
      content: reminderMessage.content,
      components: reminderMessage.components,
      embeds: reminderMessage.embeds,
    });
  }

  public static build(eventId: string) {
    return new ModalBuilder()
      .setTitle("Delay")
      .setCustomId(`event/${eventId}/delay`)
      .setComponents([
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
          new TextInputBuilder()
            .setCustomId("delay")
            .setPlaceholder("Delay")
            .setLabel("Delay (in minutes)")
            .setStyle(TextInputStyle.Short),
        ]),
      ]);
  }
}
