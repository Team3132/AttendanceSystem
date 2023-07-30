import { ApiProperty } from '@nestjs/swagger';
import { Scancode as DrizzleScancode } from '@/drizzle/drizzle.module';

export class Scancode implements DrizzleScancode {
  @ApiProperty()
  code: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;
  @ApiProperty()
  userId: string;

  constructor(scancode: DrizzleScancode) {
    Object.assign(this, scancode);
  }
}
