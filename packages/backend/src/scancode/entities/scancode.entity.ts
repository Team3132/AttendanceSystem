import { ApiProperty } from '@nestjs/swagger';
import { Scancode as PrismaScan } from '@prisma/client';

export class Scancode implements PrismaScan {
  @ApiProperty()
  code: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  userId: string;
}
