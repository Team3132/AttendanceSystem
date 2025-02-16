import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";
import { Route } from "@/routes/_authenticated/events/$eventId";
import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useDisclosure } from "../../../hooks/useDisclosure";
import AdminRSVPListItem from "./AdminRsvpListItem";
import MyRsvpStatus from "./MyRsvpStatus";
import RSVPAddDialog from "./RSVPAddDialog";
import RSVPListItem from "./RSVPListItem";

interface RsvpListProps {
  eventId: string;
}

export default function RsvpList({ eventId }: RsvpListProps) {
  return (
    <Paper>
      <Stack spacing={2} m={2}>
        <Typography variant="h5">RSVPs</Typography>
        <Suspense fallback={<SkeletonTextInput />}>
          <MyRsvpStatus />
        </Suspense>
        <Suspense fallback={<SkeletonRSVPList />}>
          <RSVPList />
        </Suspense>
        <Suspense fallback={null}>
          <RSVPAddButton eventId={eventId} />
        </Suspense>
      </Stack>
    </Paper>
  );
}

function SkeletonTextInput() {
  return <Skeleton width={100} />;
}

function RSVPSkeletonItem() {
  return (
    <ListItem>
      <ListItemAvatar>
        <Skeleton variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton width={100} />}
        secondary={<Skeleton width={50} />}
      />
    </ListItem>
  );
}

function SkeletonRSVPList() {
  return (
    <List>
      <RSVPSkeletonItem />
      <RSVPSkeletonItem />
      <RSVPSkeletonItem />
    </List>
  );
}

function RSVPList() {
  const { eventId } = Route.useParams();

  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());
  const rsvpsQuery = useSuspenseQuery(eventQueryOptions.eventRsvps(eventId));

  if (authStatusQuery.data.isAdmin) {
    return (
      <List>
        {rsvpsQuery.data.map((rsvp) => (
          <AdminRSVPListItem rsvp={rsvp} key={rsvp.id} />
        ))}
      </List>
    );
  }

  return (
    <List>
      {rsvpsQuery.data.map((rsvp) => (
        <RSVPListItem rsvp={rsvp} key={rsvp.id} />
      ))}
    </List>
  );
}

interface RSVPAddButtonProps {
  eventId: string;
}

function RSVPAddButton(props: RSVPAddButtonProps) {
  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();

  if (!authStatusQuery.data.isAdmin) {
    return null;
  }

  return (
    <>
      <Button {...getButtonProps()} variant="contained">
        Create or Edit RSVP
      </Button>
      {isOpen ? (
        <RSVPAddDialog eventId={props.eventId} {...getDisclosureProps()} />
      ) : null}
    </>
  );
}
