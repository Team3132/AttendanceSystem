import { StringOption } from 'necord';

export class CheckinDto {
  @StringOption({
    name: 'meeting',
    description: 'The meeting to get the attendance for.',
    required: true,
    autocomplete: true,
  })
  meeting: string;
  @StringOption({
    max_length: 6,
    min_length: 6,
    required: true,
    name: 'code',
    description: 'The code on the event screen.',
  })
  code: string;
}
