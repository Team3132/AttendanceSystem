import { type RSVPStatus } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';

/**
 * The data used to update an RSVP
 */
export class UpdateRsvpDto {
  @IsEnum(['LATE', 'MAYBE', 'NO', 'YES'])
  @ApiProperty({ enum: ['LATE', 'MAYBE', 'NO', 'YES'], required: false })
  @IsOptional()
  status?: RSVPStatus;
  @IsDateString()
  @ApiProperty({ required: false })
  @IsOptional()
  checkoutTime?: string;
  @IsDateString()
  @ApiProperty({ required: false })
  @IsOptional()
  checkinTime?: string;
}
