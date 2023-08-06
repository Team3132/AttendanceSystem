import { useQuery } from "@tanstack/react-query";
import eventApi from "../../../api/query/event.api";
import { List, Paper, Stack, Typography } from "@mui/material";
import ErrorCard from "../../../components/ErrorCard";
import RSVPListItem from "./RSVPListItem";
import MyRsvpStatus from "./MyRsvpStatus";

interface RsvpListProps {
  eventId: string;
}

export default function RsvpList({ eventId }: RsvpListProps) {
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
            {rsvpsQuery.data.map((rsvp) => (
              <RSVPListItem rsvp={rsvp} key={rsvp.id} />
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
