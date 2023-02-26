import { RSVPStatus } from '@prisma/client';

export default function rsvpToDescription(rsvp: {
  status: RSVPStatus;
  userId: string;
  user: { username?: string };
}) {
  return `${rsvp.user.username ?? ''} - ${
    rsvp.status === RSVPStatus.LATE
      ? `:clock3:`
      : rsvp.status === 'YES'
      ? `:white_check_mark:`
      : rsvp.status === 'MAYBE'
      ? ':grey_question:'
      : ':x:'
  }`;
}
