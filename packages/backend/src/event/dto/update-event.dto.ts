import { ApiProperty } from '@nestjs/swagger';
import { EventTypes } from '@prisma/client';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

/**
 * The data used to update an event
 */
export class UpdateEventDto {
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
  @IsEnum(EventTypes)
  @ApiProperty({ enum: EventTypes })
  type?: EventTypes;
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty()
  roles?: string[];
}
