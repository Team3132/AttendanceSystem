import { ApiProperty } from '@nestjs/swagger';
import { EventTypes } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

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
  startDate: Date;
  @IsDateString()
  @ApiProperty()
  endDate: Date;
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;
  @IsOptional()
  @IsEnum(EventTypes)
  @ApiProperty({ enum: EventTypes })
  type?: EventTypes;
  @IsOptional()
  @IsString({
    each: true,
  })
  roles?: string[];
}
