import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumberString, IsOptional } from 'class-validator';

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
}
