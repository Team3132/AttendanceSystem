import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { RsvpService } from '@rsvp/rsvp.service';
import { RsvpModule } from '@rsvp/rsvp.module';
import { ScancodeService } from '@scancode/scancode.service';
import { ScancodeModule } from '@scancode/scancode.module';
import { AuthenticatorService } from '@authenticator/authenticator.service';
import { AuthenticatorModule } from '@authenticator/authenticator.module';

@Module({
  controllers: [EventController],
  providers: [EventService, RsvpService, ScancodeService, AuthenticatorService],
  exports: [EventService],
  imports: [RsvpModule, ScancodeModule, AuthenticatorModule],
})
export class EventModule {}
