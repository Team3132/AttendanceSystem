import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { eventTypes } from '../../../drizzle/schema';
import { type EventTypes } from '@/drizzle/drizzle.module';

/**
 * The data used to update an event
 */
export class UpdateEventDto implements Partial<Event> {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: Date;
  @IsDateString()
  @ApiProperty({ required: false })
  @IsOptional()
  endDate?: Date;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;
  @IsOptional()
  @IsEnum(eventTypes.enumValues)
  @ApiProperty({ enum: eventTypes.enumValues })
  type?: EventTypes;
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty()
  roles?: string[];
}
