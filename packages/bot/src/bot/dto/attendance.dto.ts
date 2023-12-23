import { Role } from 'discord.js';
import { RoleOption, StringOption } from 'necord';

export class AttendanceDto {
  @StringOption({
    name: 'meeting',
    description: 'The meeting to get the attendance for.',
    required: true,
    autocomplete: true,
  })
  meeting: string;
  @RoleOption({
    name: 'role',
    description: 'The role to show the RSVPs',
    required: false,
  })
  role?: Role | undefined;
}
