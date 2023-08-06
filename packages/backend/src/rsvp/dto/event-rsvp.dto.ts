import { Rsvp } from '../entities/rsvp.entity';
import {
  Rsvp as DrizzleRsvp,
  Event as DrizzleEvent,
} from '../../drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import {
  EventResponse,
  EventResponseType,
} from '@/event/dto/event-response.dto';

export class RsvpEvent extends Rsvp {
  @ApiProperty({ type: EventResponse })
  event: EventResponseType;

  constructor(rsvp: DrizzleRsvp, event: DrizzleEvent) {
    super(rsvp);
    this.event = new EventResponse(event);
  }
}
