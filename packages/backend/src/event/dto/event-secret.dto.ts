import { type Event } from '@/drizzle/drizzle.module';
import { ApiProperty } from '@nestjs/swagger';
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
