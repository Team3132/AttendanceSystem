import { ApiProperty } from '@nestjs/swagger';
import { RSVP as PrismaRSVP, RSVPStatus } from '@prisma/client';

/**
 * The RSVP object.
 */
export class Rsvp implements PrismaRSVP {
  @ApiProperty()
  id: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty({ enum: RSVPStatus, nullable: true })
  status: RSVPStatus | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  attended: boolean;
}
