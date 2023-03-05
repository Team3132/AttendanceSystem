import { EventTypes } from '@prisma/client';
import { Role } from 'discord.js';
import { BooleanOption, RoleOption, StringOption } from 'necord';

export class CreateDto {
  @StringOption({
    choices: Object.entries(EventTypes).map(([name, value]) => ({
      name,
      value,
    })),
    name: 'eventtype',
    description: 'Choose the type of event',
    required: false,
  })
  eventType?: 'Outreach' | 'Regular' | 'Social';
  @StringOption({
    name: 'eventname',
    description: 'The name of the event',
  })
  eventName: string;
  @RoleOption({
    name: 'role',
    description: 'The primary role for this event',
    required: false,
  })
  role?: Role;
  @BooleanOption({
    name: 'allday',
    description: 'Whether the event lasts all day.',
    required: false,
  })
  allday?: boolean;
}
