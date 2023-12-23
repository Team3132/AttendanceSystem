import { List, Typography } from '@mui/material';
import PendingEventListItem from './PendingEventListItem';
import { RSVPEventSchema } from 'backend/schema';
import { z } from 'zod';
import { trpc } from '@/trpcClient';

interface ActiveEventsListProps {
  initialPendingEvents: z.infer<typeof RSVPEventSchema>[];
}

export default function ActiveEventsList(props: ActiveEventsListProps) {
  const { initialPendingEvents } = props;

  const pendingEventsQuery = trpc.users.getSelfPendingRsvps.useQuery(
    undefined,
    {
      initialData: initialPendingEvents,
    },
  );

  if (pendingEventsQuery.data) {
    if (pendingEventsQuery.data.length === 0)
      return <Typography textAlign={'center'}>No pending events</Typography>;

    return (
      <List>
        {pendingEventsQuery.data.map((rsvp) => (
          <PendingEventListItem rsvp={rsvp} key={rsvp.id} />
        ))}
      </List>
    );
  }

  return null;
}
