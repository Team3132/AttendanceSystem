import { useQuery } from "@tanstack/react-query";
import eventApi from "../../../api/query/event.api";
import { List, Paper, Stack, Typography } from "@mui/material";
import ErrorCard from "../../../components/ErrorCard";
import RSVPListItem from "./RSVPListItem";
import MyRsvpStatus from "./MyRsvpStatus";
import AdminRSVPListItem from "./AdminRsvpListItem";

interface RsvpListProps {
  eventId: string;
  admin?: boolean;
}

export default function RsvpList({ eventId, admin = false }: RsvpListProps) {
  const rsvpsQuery = useQuery(eventApi.getEventRsvps(eventId));

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
        </Stack>
      </Paper>
    );
  }

  if (rsvpsQuery.isError) {
    return <ErrorCard error={rsvpsQuery.error} />;
  }

  return <Typography>Loading...</Typography>;
}
