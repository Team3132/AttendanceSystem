import { trpc } from "@/trpcClient";
import { List, Typography } from "@mui/material";
import type { RSVPEventSchema } from "backend/schema";
import type { z } from "zod";
import PendingEventListItem from "./PendingEventListItem";

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

  if (pendingEventsQuery.data.length === 0)
    return <Typography textAlign={"center"}>No pending events</Typography>;

  return (
    <List>
      {pendingEventsQuery.data.map((rsvp) => (
        <PendingEventListItem rsvp={rsvp} key={rsvp.id} />
      ))}
    </List>
  );
}
