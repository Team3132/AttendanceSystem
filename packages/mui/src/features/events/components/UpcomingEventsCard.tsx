import { useQuery } from "@tanstack/react-query";
import eventApi from "../../../api/query/event.api";
import { List, Paper, Stack, Typography } from "@mui/material";
import ErrorCard from "../../../components/ErrorCard";
import UpcomingEventListItem from "./UpcomingEventListItem";
import { DateTime } from "luxon";
import { useState } from "react";

export default function UpcomingEventsCard() {
  const [fromDate] = useState(DateTime.local().toISODate() ?? undefined);
  const [toDate] = useState(
    DateTime.local().plus({ month: 1 }).toISODate() ?? undefined,
  );

  const eventsQuery = useQuery(
    eventApi.getEvents({
      take: 5,
      from: fromDate,
      to: toDate,
    }),
  );

  if (eventsQuery.data) {
    return (
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Stack gap={2}>
          <Typography variant="h4">Upcoming Events</Typography>
          <List>
            {eventsQuery.data.map((event) => (
              <UpcomingEventListItem event={event} />
            ))}
          </List>
        </Stack>
      </Paper>
    );
  }

  if (eventsQuery.isError) {
    return <ErrorCard error={eventsQuery.error} />;
  }

  return (
    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h4">Loading...</Typography>
    </Paper>
  );
}
