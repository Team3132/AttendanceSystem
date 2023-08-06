import { useQuery } from "@tanstack/react-query";
import { RsvpEvent } from "../api/generated";
import userApi from "../api/query/user.api";
import { List, Typography } from "@mui/material";
import PendingEventListItem from "./PendingEventListItem";

interface ActiveEventsListProps {
  initialPendingEvents: RsvpEvent[];
}

export default function ActiveEventsList(props: ActiveEventsListProps) {
  const { initialPendingEvents } = props;

  const pendingEventsQuery = useQuery({
    ...userApi.getPendingRsvps(),
    initialData: initialPendingEvents,
  });

  if (pendingEventsQuery.data) {
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

  return null;
}
