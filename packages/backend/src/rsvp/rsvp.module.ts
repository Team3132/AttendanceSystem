import { Module } from '@nestjs/common';
import { RsvpService } from './rsvp.service';

@Module({
  controllers: [],
  providers: [RsvpService],
  exports: [RsvpService],
})
export class RsvpModule {}
