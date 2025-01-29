import { Module } from "@nestjs/common";
import { BackendModule } from "../backend/backend.module";
import { BotService } from "./bot.service";
import { CheckinButton } from "./buttons/CheckinButton";
import { CheckoutButton } from "./buttons/CheckoutButton";
import { OutreachPaginationButton } from "./buttons/OutreachPaginationButton";
import { RsvpButton } from "./buttons/RsvpButton";
import { RsvpsButton } from "./buttons/RsvpsButton";
import { RequestRsvpCommand } from "./commands/RequestRsvp.command";
import { RsvpsCommand } from "./commands/Rsvps.command";
import { SyncPlzCommand } from "./commands/SyncPlz.command";
import { GuildJoinEvent } from "./events/GuildJoin.event";
import { CheckinModal } from "./modals/Checkin.modal";
import { DelayModal } from "./modals/Delay.modal";
// import { BuildPointsPaginationButton } from './buttons/BuildPointsPaginationButton';

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
    GuildJoinEvent,
    DelayModal,
    CheckinModal,
    CheckoutButton,
    OutreachPaginationButton,
    // BuildPointsPaginationButton,
    SyncPlzCommand,
  ],
  exports: [BotService],
})
export class BotModule {}
