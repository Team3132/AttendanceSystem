import { Injectable, UseGuards } from '@nestjs/common';
import { Button, Context, type ButtonContext, ComponentParam } from 'necord';
import { CheckinModal } from '../modals/Checkin.modal';
import { GuildMemberGuard } from '../guards/GuildMemberGuard';

@Injectable()
export class CheckinButton {
  constructor() {}

  @UseGuards(GuildMemberGuard)
  @Button('event/:eventId/checkin')
  public async onRsvpsButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
  ) {
    return interaction.showModal(CheckinModal.build(eventId));
  }
}
