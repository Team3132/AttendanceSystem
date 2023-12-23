import { Inject, Injectable } from '@nestjs/common';
import { Button, Context, type ButtonContext, ComponentParam } from 'necord';
import {
  BACKEND_TOKEN,
  isTRPCClientError,
  type BackendClient,
} from '@/backend/backend.module';

@Injectable()
export class CheckoutButton {
  constructor(
    @Inject(BACKEND_TOKEN) private readonly backendClient: BackendClient,
  ) {}

  @Button('event/:eventId/checkout')
  public async onCheckout(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
  ) {
    const userId = interaction.user.id;
    try {
      await this.backendClient.bot.checkout.mutate({
        eventId,
        userId,
      });
      await interaction.reply({
        content: `You have been successfully checked out.`,
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
          content: `Something went wrong. Please try again later.`,
          ephemeral: true,
        });
      }
    }
  }
}
