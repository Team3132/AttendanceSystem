import { Button, List, Paper, Stack, Typography } from "@mui/material";
import { useDisclosure } from "../../../hooks/useDisclosure";
import AdminRSVPListItem from "./AdminRsvpListItem";
import MyRsvpStatus from "./MyRsvpStatus";
import RSVPAddDialog from "./RSVPAddDialog";
import RSVPListItem from "./RSVPListItem";
import { useSuspenseQuery } from "@tanstack/react-query";
import { eventQueryOptions } from "@/queries/events.queries";

interface RsvpListProps {
  eventId: string;
  admin?: boolean;
}

export default function RsvpList({ eventId, admin = false }: RsvpListProps) {
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();

  return (
    <Paper
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h5">RSVPs</Typography>
        <MyRsvpStatus eventId={eventId} />
        {admin ? (
          <AdminRSVPList eventId={eventId} />
        ) : (
          <RSVPList eventId={eventId} />
        )}
        {admin ? (
          <Button {...getButtonProps()} variant="contained">
            Create or Edit RSVP
          </Button>
        ) : null}
        {admin && isOpen ? (
          <RSVPAddDialog eventId={eventId} {...getDisclosureProps()} />
        ) : null}
      </Stack>
    </Paper>
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
