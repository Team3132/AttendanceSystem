import { ApiProperty } from '@nestjs/swagger';
import { RSVPStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

/**
 * The data used to edit or create a new RSVP
 */
export class UpdateOrCreateRSVP {
  // @IsEnum(RSVPStatus)
  @IsNotEmpty()
  @ApiProperty({ enum: RSVPStatus })
  status: RSVPStatus;
  @IsOptional()
  @IsNumber()
  @ApiProperty({ nullable: true })
  delay?: number;
}
