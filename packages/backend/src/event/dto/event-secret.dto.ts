import { ApiProperty } from '@nestjs/swagger';
import { Event } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EventSecret {
  @Expose()
  @ApiProperty()
  secret: string;
  constructor(event: Event) {
    Object.assign(this, event);
  }
}
