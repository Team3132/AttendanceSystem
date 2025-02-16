import { usersQueryOptions } from "@/queries/users.queries";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import PendingEventListItem from "./PendingEventListItem";

export default function ActiveEventsList() {
  return (
    <Suspense fallback={<SkeletonList />}>
      <EventList />
    </Suspense>
  );
}

function EventList() {
  const pendingEventsQuery = useSuspenseQuery(
    usersQueryOptions.userSelfPendingRsvps(),
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

function SkeletonListItem() {
  return (
    <ListItem>
      <ListItemText
        primary={<Skeleton width="300" />}
        secondary={<Skeleton width="200" />}
      />
      <Button variant="contained" color="primary" loading>
        Checkout
      </Button>
    </ListItem>
  );
}

function SkeletonList() {
  return (
    <List>
      <SkeletonListItem />
    </List>
  );
}
