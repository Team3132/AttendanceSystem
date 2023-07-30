import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { eventTypes } from '../../drizzle/schema';
import { type EventTypes } from '@/drizzle/drizzle.module';

/**
 * The data used to create an event
 */
export class CreateEventDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsDateString()
  startDate: string;
  @IsDateString()
  @ApiProperty()
  endDate: string;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;
  @IsOptional()
  @IsEnum(eventTypes.enumValues)
  @ApiProperty({ enum: ['Social', 'Regular', 'Outreach'] })
  type?: EventTypes;
  @IsOptional()
  @ApiProperty({ required: false })
  @IsString({
    each: true,
  })
  roles?: string[];
}
