import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ActionRowBuilder,
  type ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "discord.js";
import { TextInputStyle } from "discord.js";
import { DateTime } from "luxon";
import { Ctx, Modal, type ModalContext, ModalParam } from "necord";
import { z } from "zod";
import {
  BACKEND_TOKEN,
  type BackendClient,
} from "../../backend/backend.module";
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

    const eventData =
      await this.backendClient.client.getEventDetails.query(eventId);

    const startDateTime = DateTime.fromISO(
      new Date(eventData.startDate).toISOString(),
    );

    const arrivingAt =
      startDateTime.plus({ minutes: value.data }).toISO() ?? undefined;

    await this.backendClient.client.setEventRsvp.mutate({
      eventId,
      userId,
      status: "LATE",
      arrivingAt,
    });

    const reminderMessage =
      await this.backendClient.client.getEventReminder.query(eventId);

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
