import { ApiProperty } from '@nestjs/swagger';
import { Rsvp as DrizzleRsvp, RSVPStatus } from '../../drizzle/drizzle.module';
import { rsvpStatus } from '../../drizzle/schema';

/**
 * The RSVP object.
 */
export class Rsvp implements DrizzleRsvp {
  @ApiProperty()
  id: string;
  @ApiProperty()
  eventId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty({ enum: rsvpStatus.enumValues, nullable: true })
  status: RSVPStatus | null;
  @ApiProperty({ nullable: true })
  delay: number | null;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;
  @ApiProperty()
  attended: boolean;

  constructor(rsvp: DrizzleRsvp) {
    Object.assign(this, rsvp);
  }
}
