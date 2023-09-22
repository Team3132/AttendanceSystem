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
import { EventModule } from '@/event/event.module';
import { EventService } from '@/event/event.service';
import { QRCodeCommand } from './commands/QRCode.command';

@Module({
  controllers: [BotController],
  imports: [
    OutreachModule,
    BullModule.registerQueue({ name: 'event' }),
    EventModule,
  ],
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
    EventService,
    QRCodeCommand,
  ],
  exports: [BotService],
})
export class BotModule {}
