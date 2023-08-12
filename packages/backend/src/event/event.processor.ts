import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CheckoutActiveData } from './types/CheckoutActive';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { rsvp } from '@/drizzle/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { DateTime } from 'luxon';

@Processor('event')
export class EventProcessor {
  private readonly logger = new Logger(EventProcessor.name);

  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase) {}

  @Process('checkoutActive')
  async handleCheckoutActive(job: Job<CheckoutActiveData>) {
    const { eventId, rsvpId } = job.data;

    const currentTime = DateTime.local();

    const fetchedEvent = await this.db.query.event.findFirst({
      where: (event, { eq }) => eq(event.id, eventId),
    });

    if (!fetchedEvent) throw new Error('Event not found');

    const eventEndTime = DateTime.fromISO(fetchedEvent.endDate);

    const checkoutTime =
      currentTime > eventEndTime ? eventEndTime : currentTime;

    await this.db
      .update(rsvp)
      .set({
        checkoutTime: checkoutTime.toISO(),
      })
      .where(and(eq(rsvp.id, rsvpId), isNull(rsvp.checkoutTime)));
  }

  @OnQueueActive()
  onActive(job: Job<CheckoutActiveData>) {
    this.logger.log(`Processing job ${job.id}`);
  }
}
