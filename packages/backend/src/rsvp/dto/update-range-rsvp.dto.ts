import { type RSVPStatus } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';

export class UpdateRangeRSVP {
  @ApiProperty()
  @IsDateString()
  from: string;
  @ApiProperty()
  @IsDateString()
  to: string;
  @IsEnum(['LATE', 'MAYBE', 'NO', 'YES'])
  @ApiProperty({ enum: ['LATE', 'MAYBE', 'NO', 'YES'] })
  status: RSVPStatus;
}
