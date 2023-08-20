import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Button, Context, ButtonContext, ComponentParam } from 'necord';
import { DRIZZLE_TOKEN, type DrizzleDatabase } from '@/drizzle/drizzle.module';
import { CheckinModal } from '../modals/Checkin.modal';

@Injectable()
export class CheckinButton {
  constructor(
    @Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDatabase,
    private readonly config: ConfigService,
  ) {}

  @Button('event/:eventId/checkin')
  public async onRsvpsButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('eventId') eventId: string,
  ) {
    return interaction.showModal(CheckinModal.build(eventId));
  }
}
