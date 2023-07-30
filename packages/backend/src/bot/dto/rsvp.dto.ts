import { type RSVPStatus } from '@/drizzle/drizzle.module';
import { StringOption } from 'necord';

export class RsvpDto {
  @StringOption({
    name: 'meeting',
    description: 'The meeting to rsvp to.',
    required: true,
    autocomplete: true,
  })
  meeting: string;
  @StringOption({
    name: 'status',
    description: 'The status you want to set.',
    required: true,
    choices: [
      {
        name: 'Coming',
        value: 'YES',
      },
      {
        name: 'Maybe',
        value: 'MAYBE',
      },
      {
        name: 'Not Coming',
        value: 'NO',
      },
    ],
  })
  status: RSVPStatus;
}
