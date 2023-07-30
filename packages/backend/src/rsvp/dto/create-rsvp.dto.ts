import { type RSVPStatus } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

/**
 * The data used to create an RSVP
 */
export class CreateRsvpDto {
  @IsString()
  @ApiProperty()
  eventId: string;
  @IsEnum(['LATE', 'MAYBE', 'NO', 'YES'])
  @ApiProperty({ enum: ['LATE', 'MAYBE', 'NO', 'YES'] })
  status: RSVPStatus;
}
