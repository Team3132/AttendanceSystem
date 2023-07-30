import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { RsvpButton } from './buttons/RsvpButton';
import { RsvpsButton } from './buttons/RsvpsButton';
import { AttendanceCommand } from './commands/Attendance.command';
import { CheckinCommand } from './commands/Checkin.command';
import { CreateCommand } from './commands/Create.command';
import { MeetingsCommand } from './commands/Meetings.command';
import { RequestRsvpCommand } from './commands/RequestRsvp.command';
import { RsvpCommand } from './commands/Rsvp.command';
import { RsvpsCommand } from './commands/Rsvps.command';
import { DelayModal } from './modals/Delay.modal';

@Module({
  controllers: [BotController],
  imports: [],
  providers: [
    BotService,
    RsvpButton,
    RsvpsButton,
    AttendanceCommand,
    CheckinCommand,
    MeetingsCommand,
    RequestRsvpCommand,
    RsvpCommand,
    RsvpsCommand,
    CreateCommand,
    DelayModal,
  ],
  exports: [BotService],
})
export class BotModule {}
