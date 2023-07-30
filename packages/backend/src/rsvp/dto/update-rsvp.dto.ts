import { type RSVPStatus } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

/**
 * The data used to update an RSVP
 */
export class UpdateRsvpDto {
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  eventId?: string;
  @IsEnum(['LATE', 'MAYBE', 'NO', 'YES'])
  @ApiProperty({ enum: ['LATE', 'MAYBE', 'NO', 'YES'], required: false })
  @IsOptional()
  status?: RSVPStatus;
  @IsBoolean()
  @ApiProperty({ required: false })
  @IsOptional()
  attended?: boolean;
}
