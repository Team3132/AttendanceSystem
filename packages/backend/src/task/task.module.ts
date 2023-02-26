import { AuthenticatorModule } from '@/authenticator/authenticator.module';
import { AuthenticatorService } from '@/authenticator/authenticator.service';
import { EventModule } from '@/event/event.module';
import { EventService } from '@/event/event.service';
import { GcalModule } from '@/gcal/gcal.module';
import { GcalService } from '@/gcal/gcal.service';
import { RsvpModule } from '@/rsvp/rsvp.module';
import { RsvpService } from '@/rsvp/rsvp.service';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
  providers: [
    TaskService,
    GcalService,
    EventService,
    AuthenticatorService,
    RsvpService,
  ],
  exports: [TaskService],
  imports: [GcalModule, EventModule, AuthenticatorModule, RsvpModule],
})
export class TaskModule {}
