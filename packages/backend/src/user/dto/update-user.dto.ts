import { RSVPStatus } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

/**
 * The data used to update a user
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEnum({ ...['LATE', 'MAYBE', 'YES', 'NO'], unknown: null })
  @ApiProperty({
    required: false,
    enum: ['LATE', 'MAYBE', 'YES', 'NO'],
    nullable: true,
  })
  defaultStatus?: RSVPStatus | null;
}
