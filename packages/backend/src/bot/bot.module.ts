import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { RsvpButton } from './buttons/RsvpButton';
import { RsvpsButton } from './buttons/RsvpsButton';
import { CheckinCommand } from './commands/Checkin.command';
import { CreateCommand } from './commands/Create.command';
import { MeetingsCommand } from './commands/Meetings.command';
import { RequestRsvpCommand } from './commands/RequestRsvp.command';
import { RsvpCommand } from './commands/Rsvp.command';
import { RsvpsCommand } from './commands/Rsvps.command';
import { DelayModal } from './modals/Delay.modal';
import { LeaderBoardCommand } from './commands/Leaderboard.command';
import { OutreachModule } from '@/outreach/outreach.module';
import { OutreachService } from '@/outreach/outreach.service';

@Module({
  controllers: [BotController],
  imports: [OutreachModule],
  providers: [
    BotService,
    RsvpButton,
    RsvpsButton,
    CheckinCommand,
    MeetingsCommand,
    RequestRsvpCommand,
    RsvpCommand,
    RsvpsCommand,
    CreateCommand,
    LeaderBoardCommand,
    DelayModal,
    OutreachService,
  ],
  exports: [BotService],
})
export class BotModule {}
