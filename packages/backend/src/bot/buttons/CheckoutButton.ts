import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Button, Context, ButtonContext, ComponentParam } from 'necord';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import { event, rsvp } from '@/drizzle/schema';

@Injectable()
export class CheckoutButton {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
  ) {}

  @Button('event/:eventId/checkout')
  public async onCheckout(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
  ) {
    const fetchedEvent = await this.db.query.event.findFirst({
      where: eq(event.id, eventId),
    });

    if (!fetchedEvent) {
      return interaction.reply({
        content: 'Event not found.',
        ephemeral: true,
      });
    }

    const checkoutableRsvp = await this.db.query.rsvp.findFirst({
      where: and(
        eq(rsvp.eventId, eventId),
        eq(rsvp.userId, interaction.user.id),
        isNotNull(rsvp.checkinTime),
        isNull(rsvp.checkoutTime),
      ),
    });

    if (!checkoutableRsvp) {
      return interaction.reply({
        content: 'You have not checked in or have already checked out.',
        ephemeral: true,
      });
    }

    const [updatedRsvp] = await this.db
      .update(rsvp)
      .set({
        checkoutTime: new Date().toISOString(),
      })
      .where(eq(rsvp.id, checkoutableRsvp.id))
      .returning();

    if (!updatedRsvp) {
      return interaction.reply({
        content: 'Failed to checkout.',
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Checked out from ${fetchedEvent.title}`,
      ephemeral: true,
    });
  }
}
