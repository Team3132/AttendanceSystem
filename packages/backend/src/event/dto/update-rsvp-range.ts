import { RSVPStatus } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';

export class UpdateRangeRSVP {
  @ApiProperty()
  @IsDateString()
  from: string;
  @ApiProperty()
  @IsDateString()
  to: string;
  @IsEnum(['LATE', 'MAYBE', 'YES', 'NO'])
  @ApiProperty({ enum: ['LATE', 'MAYBE', 'YES', 'NO'] })
  status: RSVPStatus;
}
