import { Button, List, Paper, Stack, Typography } from "@mui/material";
import { useDisclosure } from "../../../hooks/useDisclosure";
import AdminRSVPListItem from "./AdminRsvpListItem";
import MyRsvpStatus from "./MyRsvpStatus";
import RSVPAddDialog from "./RSVPAddDialog";
import RSVPListItem from "./RSVPListItem";
import { useQuery } from "@tanstack/react-query";
import { eventQueryOptions } from "@/queries/events.queries";

interface RsvpListProps {
  eventId: string;
  admin?: boolean;
}

export default function RsvpList({ eventId, admin = false }: RsvpListProps) {
  const rsvpsQuery = useQuery(eventQueryOptions.eventRsvps(eventId));
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();

  if (rsvpsQuery.data) {
    return (
      <Paper
        sx={{
          p: 2,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5">RSVPs ({rsvpsQuery.data.length})</Typography>
          <MyRsvpStatus eventId={eventId} />
          <List>
            {!admin
              ? rsvpsQuery.data.map((rsvp) => (
                  <RSVPListItem rsvp={rsvp} key={rsvp.id} />
                ))
              : rsvpsQuery.data.map((rsvp) => (
                  <AdminRSVPListItem rsvp={rsvp} key={rsvp.id} />
                ))}
          </List>
          {admin ? (
            <Button {...getButtonProps()} variant="contained">
              Add Empty RSVP
            </Button>
          ) : null}
          {admin && isOpen ? (
            <RSVPAddDialog eventId={eventId} {...getDisclosureProps()} />
          ) : null}
        </Stack>
      </Paper>
    );
  }

  return <Typography>Loading...</Typography>;
}
