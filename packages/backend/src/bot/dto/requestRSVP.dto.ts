import { StringOption } from 'necord';

export class RequestRSVPDto {
  @StringOption({
    name: 'meeting',
    description: 'The meeting to get the attendance for.',
    required: true,
    autocomplete: true,
  })
  meeting: string;
}
