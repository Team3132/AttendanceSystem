import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

/**
 * The data used to update a user
 */
export class GetOutreachReport {
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  from?: string;
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  to?: string;
}
