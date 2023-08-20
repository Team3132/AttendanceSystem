import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { RsvpButton } from './buttons/RsvpButton';
import { RsvpsButton } from './buttons/RsvpsButton';
import { RequestRsvpCommand } from './commands/RequestRsvp.command';
import { RsvpsCommand } from './commands/Rsvps.command';
import { DelayModal } from './modals/Delay.modal';
import { LeaderBoardCommand } from './commands/Leaderboard.command';
import { OutreachModule } from '@/outreach/outreach.module';
import { OutreachService } from '@/outreach/outreach.service';
import { BullModule } from '@nestjs/bull';
import { CheckinButton } from './buttons/CheckinButton';
import { CheckinModal } from './modals/Checkin.modal';

@Module({
  controllers: [BotController],
  imports: [OutreachModule, BullModule.registerQueue({ name: 'event' })],
  providers: [
    BotService,
    RsvpButton,
    CheckinButton,
    RsvpsButton,
    RequestRsvpCommand,
    RsvpsCommand,
    LeaderBoardCommand,
    DelayModal,
    OutreachService,
    CheckinModal,
  ],
  exports: [BotService],
})
export class BotModule {}
