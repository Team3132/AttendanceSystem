import { ApiProperty } from '@nestjs/swagger';
import { Event as PrismaEvent, EventTypes } from '@prisma/client';

/**
 * The event object.
 */
export class Event implements PrismaEvent {
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
  @ApiProperty({ enum: EventTypes })
  type: EventTypes;
  @ApiProperty()
  secret: string;
  @ApiProperty()
  roles: string[];
}
