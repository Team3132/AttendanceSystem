import { Injectable } from '@nestjs/common';
import { Button, Context, ButtonContext, ComponentParam } from 'necord';
import { CheckinModal } from '../modals/Checkin.modal';

@Injectable()
export class CheckinButton {
  constructor() {}

  @Button('event/:eventId/checkin')
  public async onRsvpsButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
  ) {
    return interaction.showModal(CheckinModal.build(eventId));
  }
}
