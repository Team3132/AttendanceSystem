import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { RsvpService } from '@rsvp/rsvp.service';
import { RsvpModule } from '@rsvp/rsvp.module';
import { ScancodeService } from '@scancode/scancode.service';
import { ScancodeModule } from '@scancode/scancode.module';
import { BullModule } from '@nestjs/bull';
import { EventProcessor } from './event.processor';

@Module({
  controllers: [EventController],
  providers: [EventService, RsvpService, ScancodeService, EventProcessor],
  exports: [EventService],
  imports: [
    RsvpModule,
    ScancodeModule,
    BullModule.registerQueue({ name: 'event' }),
  ],
})
export class EventModule {}
