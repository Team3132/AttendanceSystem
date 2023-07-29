import { Event, EventTypes } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { eventTypes } from '../../../drizzle/schema';
// import { Event } from '../entities/event.entity';

export class EventResponse implements Event {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  allDay: boolean;
  @ApiProperty({ enum: eventTypes.enumValues })
  type: EventTypes;
  @ApiProperty()
  roles: string[];

  @Exclude()
  secret: string;

  @ApiProperty()
  isSyncedEvent: boolean;

  constructor(event: Event) {
    Object.assign(this, event);
  }
}

export class EventResponseType implements Partial<Event> {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  allDay: boolean;
  @ApiProperty({ enum: eventTypes.enumValues })
  type: EventTypes;
  @ApiProperty()
  roles: string[];
}
