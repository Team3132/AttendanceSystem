import { type RSVPStatus } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

/**
 * The data used to edit or create a new RSVP
 */
export class UpdateOrCreateRSVP {
  // @IsEnum(RSVPStatus)
  @IsNotEmpty()
  @ApiProperty({ enum: ['LATE', 'MAYBE', 'NO', 'YES'] })
  status: RSVPStatus;
  @IsOptional()
  @IsNumber()
  @ApiProperty({ nullable: true })
  delay?: number;
}
