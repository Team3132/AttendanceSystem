import { Button, List, Paper, Stack, styled, Typography } from "@mui/material";
import { useDisclosure } from "../../../hooks/useDisclosure";
import AdminRSVPListItem from "./AdminRsvpListItem";
import MyRsvpStatus from "./MyRsvpStatus";
import RSVPAddDialog from "./RSVPAddDialog";
import RSVPListItem from "./RSVPListItem";
import { useSuspenseQuery } from "@tanstack/react-query";
import { eventQueryOptions } from "@/queries/events.queries";
import { authQueryOptions } from "@/queries/auth.queries";

interface RsvpListProps {
  eventId: string;
}

export default function RsvpList({ eventId }: RsvpListProps) {
  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

  return (
    <Paper>
      <Stack spacing={2} m={2}>
        <Typography variant="h5">RSVPs</Typography>
        <MyRsvpStatus eventId={eventId} />
        {authStatusQuery.data.isAdmin ? (
          <AdminRSVPList eventId={eventId} />
        ) : (
          <RSVPList eventId={eventId} />
        )}
        {authStatusQuery.data.isAdmin ? (
          <RSVPAddButton eventId={eventId} />
        ) : null}
      </Stack>
    </Paper>
  );
}

interface RSVPAddButtonProps {
  eventId: string;
}

function RSVPAddButton(props: RSVPAddButtonProps) {
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();

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

interface RSVPListProps {
  eventId: string;
}

function AdminRSVPList(props: RSVPListProps) {
  const rsvpsQuery = useSuspenseQuery(
    eventQueryOptions.eventRsvps(props.eventId),
  );

  return (
    <List>
      {rsvpsQuery.data.map((rsvp) => (
        <AdminRSVPListItem rsvp={rsvp} key={rsvp.id} />
      ))}
    </List>
  );
}

function RSVPList(props: RSVPListProps) {
  const rsvpsQuery = useSuspenseQuery(
    eventQueryOptions.eventRsvps(props.eventId),
  );

  return (
    <List>
      {rsvpsQuery.data.map((rsvp) => (
        <RSVPListItem rsvp={rsvp} key={rsvp.id} />
      ))}
    </List>
  );
}
