import { Inject, Injectable, UseGuards } from "@nestjs/common";
import { Button, type ButtonContext, ComponentParam, Context } from "necord";
import {
  BACKEND_TOKEN,
  type BackendClient,
  isTRPCClientError,
} from "../../backend/backend.module";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";

@Injectable()
export class CheckoutButton {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {}

  @UseGuards(GuildMemberGuard)
  @Button("event/:eventId/checkout")
  public async onCheckout(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("eventId") eventId: string,
  ) {
    const userId = interaction.user.id;
    try {
      await this.backendClient.client.checkout.mutate({
        eventId,
        userId,
      });
      await interaction.reply({
        content: "You have been successfully checked out.",
        ephemeral: true,
      });
    } catch (error) {
      if (isTRPCClientError(error)) {
        await interaction.reply({
          content: error.message,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Something went wrong. Please try again later.",
          ephemeral: true,
        });
      }
    }
  }
}
