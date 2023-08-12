import { EventModule } from '@/event/event.module';
import { GcalModule } from '@/gcal/gcal.module';
import { GcalService } from '@/gcal/gcal.service';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService, GcalService],
  exports: [TaskService],
  imports: [GcalModule, EventModule],
})
export class TaskModule {}
