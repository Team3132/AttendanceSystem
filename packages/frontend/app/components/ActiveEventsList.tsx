import { List, Typography } from "@mui/material";
import type { RSVPEventSchema } from "@/api/schema";
import type { z } from "zod";
import PendingEventListItem from "./PendingEventListItem";
import { usersQueryOptions } from "@/queries/users.queries";
import { useQuery } from "@tanstack/react-query";

interface ActiveEventsListProps {
  initialPendingEvents: z.infer<typeof RSVPEventSchema>[];
}

export default function ActiveEventsList(props: ActiveEventsListProps) {
  const { initialPendingEvents } = props;

  const pendingEventsQuery = useQuery({
    ...usersQueryOptions.userSelfPendingRsvps(),
    initialData: initialPendingEvents,
  });

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
