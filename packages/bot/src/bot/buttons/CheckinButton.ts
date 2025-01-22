import { Injectable, UseGuards } from "@nestjs/common";
import { Button, ButtonContext, ComponentParam, Context } from "necord";
import { GuildMemberGuard } from "../guards/GuildMemberGuard";
import { CheckinModal } from "../modals/Checkin.modal";

@Injectable()
export class CheckinButton {
  @UseGuards(GuildMemberGuard)
  @Button("event/:eventId/checkin")
  public async onRsvpsButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam("eventId") eventId: string,
  ) {
    return interaction.showModal(CheckinModal.build(eventId));
  }
}
