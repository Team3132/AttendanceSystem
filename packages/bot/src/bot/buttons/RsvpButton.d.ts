import { ConfigService } from "@nestjs/config";
import { type ButtonContext } from "necord";
import { type BackendClient } from "../../backend/backend.module";
export declare class RsvpButton {
  private readonly config;
  private readonly backendClient;
  constructor(config: ConfigService, backendClient: BackendClient);
  onRsvpsButton(
    [interaction]: ButtonContext,
    eventId: string,
  ): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
}
//# sourceMappingURL=RsvpButton.d.ts.map
