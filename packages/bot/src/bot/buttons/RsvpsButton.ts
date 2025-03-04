import { Inject, Injectable, Logger, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ActionRow,
  ChatInputCommandInteraction,
  GuildMember,
} from "discord.js";
import { RSVPStatusUpdateSchema } from "frontend";
import { Button, type ButtonContext, ComponentParam, Context } from "necord";
import { z } from "zod";
import {
  BACKEND_TOKEN,
  type BackendClient,
} from "../../backend/backend.module";
import { ROLES } from "../../constants";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";
import { DelayModal } from "../modals/Delay.modal";

@Injectable()
export class RsvpsButton {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(RsvpsButton.name);

  @UseGuards(GuildMemberGuard)
  @Button("event/:eventId/rsvp/:rsvpStatus")
  public async onRsvpButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("eventId") eventId: string,
    @ComponentParam("rsvpStatus") rsvpStatus: z.infer<
      typeof RSVPStatusUpdateSchema
    >,
  ) {
    const fetchedEvent =
      await this.backendClient.client.getEventDetails.query(eventId);

    if (!fetchedEvent)
      return interaction.reply({
        ephemeral: true,
        content: "This meeting doesn't exist.",
      });

    const userId = interaction.user.id;

    const interactionUser = interaction.member;

    if (!(interactionUser instanceof GuildMember)) {
      return interaction.reply("Not a guild member");
    }

    const userRoles = [
      ...interactionUser.roles.cache.mapValues((role) => role.id).values(),
    ];

    const fetchedUser = await interactionUser.fetch();

    const username = fetchedUser.nickname ?? fetchedUser.user.username;

    await this.backendClient.client.findOrCreateUser.mutate({
      id: userId,
      username,
      roles: userRoles,
    });
    // const fetchedUser = fetchedUsers.at(0);

    if (fetchedEvent.type === "Mentor" && !userRoles.includes(ROLES.MENTOR)) {
      return interaction.reply({
        ephemeral: true,
        content: "You're not a mentor.",
      });
    }

    await this.backendClient.client.setEventRsvp.mutate({
      eventId,
      userId,
      status: rsvpStatus,
    });

    this.logger.debug(`${username} RSVP'd ${rsvpStatus} to ${eventId}`);

    if (rsvpStatus === "LATE") {
      // return interaction.deferUpdate();
      return interaction.showModal(DelayModal.build(eventId));
    }

    const generatedMessage =
      await this.backendClient.client.getEventReminder.query(eventId);

    return interaction.update({
      content: generatedMessage.content,
      components: generatedMessage.components,
      embeds: generatedMessage.embeds,
    });
  }
}
