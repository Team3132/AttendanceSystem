import { ApiProperty } from '@nestjs/swagger';
import {
  Event as DrizzleEvent,
  type EventTypes,
} from '../../drizzle/drizzle.module';

/**
 * The event object.
 */
export class Event implements DrizzleEvent {
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
  @ApiProperty({ enum: ['Social', 'Regular', 'Outreach'] })
  type: EventTypes;
  @ApiProperty()
  secret: string;
  @ApiProperty()
  roles: string[];
  @ApiProperty()
  isSyncedEvent: boolean;
}
