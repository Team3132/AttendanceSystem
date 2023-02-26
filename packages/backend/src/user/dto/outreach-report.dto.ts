import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * The data used to update a user
 */
export class OutreachReport {
  @IsNumber()
  @ApiProperty({ type: 'number' })
  eventCount: number;
  @ApiProperty({ type: 'number' })
  @IsNumber()
  hourCount: number;
}
