import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { RsvpButton } from './buttons/RsvpButton';
import { RsvpsButton } from './buttons/RsvpsButton';
import { RequestRsvpCommand } from './commands/RequestRsvp.command';
import { RsvpsCommand } from './commands/Rsvps.command';
import { DelayModal } from './modals/Delay.modal';
import { LeaderBoardCommand } from './commands/Leaderboard.command';
import { CheckinButton } from './buttons/CheckinButton';
import { CheckinModal } from './modals/Checkin.modal';
import { CheckoutButton } from './buttons/CheckoutButton';

@Module({
  controllers: [],
  imports: [],
  providers: [
    BotService,
    RsvpButton,
    CheckinButton,
    RsvpsButton,
    RequestRsvpCommand,
    RsvpsCommand,
    LeaderBoardCommand,
    DelayModal,
    CheckinModal,
    CheckoutButton,
  ],
  exports: [BotService],
})
export class BotModule {}
