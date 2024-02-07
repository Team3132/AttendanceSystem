import { Role } from "discord.js";
import { BooleanOption, RoleOption, StringOption } from "necord";

export class CreateDto {
  @StringOption({
    name: "eventname",
    description: "The name of the event",
  })
  eventName: string;
  @StringOption({
    choices: ["Outreach", "Regular", "Social"].map((type) => ({
      name: type,
      value: type,
    })),
    name: "eventtype",
    description: "Choose the type of event",
    required: false,
  })
  eventType?: "Outreach" | "Regular" | "Social";
  @RoleOption({
    name: "role",
    description: "The primary role for this event",
    required: false,
  })
  role?: Role;
  @BooleanOption({
    name: "allday",
    description: "Whether the event lasts all day.",
    required: false,
  })
  allday?: boolean;
  @StringOption({
    name: "description",
    description: "Description of the event",
    required: false,
  })
  description?: string;
}
