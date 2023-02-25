import { ApiProperty } from '@nestjs/swagger';
import { RSVPStatus } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

/**
 * The data used to edit or create a new RSVP
 */
export class UpdateOrCreateRSVP {
  // @IsEnum(RSVPStatus)
  @IsNotEmpty()
  @ApiProperty({ enum: RSVPStatus })
  status: RSVPStatus;
}
