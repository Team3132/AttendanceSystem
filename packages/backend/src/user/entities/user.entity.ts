import { RSVPStatus } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
import { User as DrizzleUser } from '../../drizzle/drizzle.module';

/**
 * The user object.
 */
export class User implements Partial<DrizzleUser> {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username?: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;
  @ApiProperty({
    enum: ['LATE', 'MAYBE', 'NO', 'YES'],
    required: true,
    nullable: true,
  })
  defaultStatus: RSVPStatus | null;
  @ApiProperty()
  roles: string[];
}
