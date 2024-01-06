import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { RsvpButton } from './buttons/RsvpButton';
import { RsvpsButton } from './buttons/RsvpsButton';
import { RequestRsvpCommand } from './commands/RequestRsvp.command';
import { RsvpsCommand } from './commands/Rsvps.command';
import { DelayModal } from './modals/Delay.modal';
import { CheckinButton } from './buttons/CheckinButton';
import { CheckinModal } from './modals/Checkin.modal';
import { CheckoutButton } from './buttons/CheckoutButton';
import { BackendModule } from '@/backend/backend.module';
import { OutreachPaginationButton } from './buttons/OutreachPaginationButton';
import { BuildPointsPaginationButton } from './buttons/BuildPointsPaginationButton';

@Module({
  controllers: [],
  imports: [BackendModule],
  providers: [
    BotService,
    RsvpButton,
    CheckinButton,
    RsvpsButton,
    RequestRsvpCommand,
    RsvpsCommand,
    // LeaderBoardCommand,
    DelayModal,
    CheckinModal,
    CheckoutButton,
    OutreachPaginationButton,
    BuildPointsPaginationButton,
  ],
  exports: [BotService],
})
export class BotModule {}
