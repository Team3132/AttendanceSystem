import { ApiProperty } from '@nestjs/swagger';
import { RSVPStatus } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

/**
 * The data used to create an RSVP
 */
export class CreateRsvpDto {
  @IsString()
  @ApiProperty()
  eventId: string;
  @IsEnum(RSVPStatus)
  @ApiProperty({ enum: RSVPStatus })
  status: RSVPStatus;
}
