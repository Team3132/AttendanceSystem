import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CheckoutActiveData } from './types/CheckoutActive';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { rsvp } from '@/drizzle/schema';
import { and, eq, isNull } from 'drizzle-orm';

@Processor('event')
export class EventProcessor {
  private readonly logger = new Logger(EventProcessor.name);

  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {}

  @Process('checkoutActive')
  async handleCheckoutActive(job: Job<CheckoutActiveData>) {
    const { eventId, rsvpId } = job.data;

    const event = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });

    if (!event) throw new Error('Event not found');

    const checkoutTime = new Date(event.endDate).toISOString();

    await this.db
      .update(rsvp)
      .set({
        checkoutTime,
      })
      .where(and(eq(rsvp.id, rsvpId), isNull(rsvp.checkoutTime)));
  }

  @OnQueueActive()
  onActive(job: Job<CheckoutActiveData>) {
    this.logger.log(`Processing job ${job.id}`);
  }
}
