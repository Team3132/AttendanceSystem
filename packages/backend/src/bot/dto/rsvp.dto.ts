import { RSVPStatus } from '@prisma/client';
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
        value: RSVPStatus.YES,
      },
      {
        name: 'Maybe',
        value: RSVPStatus.MAYBE,
      },
      {
        name: 'Not Coming',
        value: RSVPStatus.NO,
      },
    ],
  })
  status: RSVPStatus;
}
