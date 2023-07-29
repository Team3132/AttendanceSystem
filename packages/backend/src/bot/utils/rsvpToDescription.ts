import { RSVPStatus } from '@/drizzle/drizzle.module';

export default function rsvpToDescription(
  rsvp: {
    status: RSVPStatus;
    userId: string;
    delay?: number | null;
    user: { username?: string };
  },
  first = false,
) {
  return `${rsvp.user.username ?? ''} - ${
    rsvp.status === 'LATE' && rsvp.delay !== null
      ? `:clock3: ${rsvp.delay} minutes late`
      : rsvp.status === 'LATE'
      ? `:clock3:`
      : rsvp.status === 'YES'
      ? `:white_check_mark:`
      : rsvp.status === 'MAYBE'
      ? ':grey_question:'
      : ':x:'
  }${first ? ' :star:' : ''}`;
}
