import type { EventTypes } from '@/drizzle/drizzle.module';
import { eventTypes } from '@/drizzle/schema';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class GetEventsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  from?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  to?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  take?: number;
  @IsOptional()
  @IsEnum(eventTypes.enumValues)
  @ApiProperty({ enum: eventTypes.enumValues, required: false })
  type?: EventTypes;
}
