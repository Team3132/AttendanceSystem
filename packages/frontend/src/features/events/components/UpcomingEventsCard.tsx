import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import UpcomingEventListItem from "./UpcomingEventListItem";
import { DateTime } from "luxon";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LinkBehavior from "../../../utils/LinkBehavior";
import { trpc } from "@/trpcClient";
import { z } from "zod";
import {
  EventSchema,
  EventTypeSchema,
} from "@team3132/attendance-backend/schema";
import { AuthStatusSchema } from "@team3132/attendance-backend/schema";

interface UpcomingEventsCardProps {
  initialAuthStatus: z.infer<typeof AuthStatusSchema>;
  initialEvents: z.infer<typeof EventSchema>[];
}

export default function UpcomingEventsCard(props: UpcomingEventsCardProps) {
  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
    initialData: props.initialAuthStatus,
  });

  const [fromDate, setFromDate] = useState(DateTime.now().startOf("day"));
  const [toDate, setToDate] = useState(
    DateTime.now().plus({ month: 1 }).startOf("day")
  );

  const [type, setType] = useState<
    z.infer<typeof EventTypeSchema> | undefined
  >();

  const eventsQuery = trpc.events.getEvents.useQuery(
    {
      take: 5,
      from: fromDate.toISO() ?? undefined,
      to: toDate.toISO() ?? undefined,
      type,
    },
    {
      initialData: props.initialEvents,
    }
  );

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as z.infer<typeof EventTypeSchema>);
  };

  if (eventsQuery.data) {
    return (
      <Paper sx={{ p: 2 }}>
        <Stack gap={2}>
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                flexGrow: 1,
              }}
            >
              Upcoming Events
            </Typography>
            <FormControl
              sx={{
                minWidth: 120,
              }}
            >
              <InputLabel id="select-event-type-label">Type</InputLabel>
              <Select
                labelId="select-event-type-label"
                id="select-event-type"
                //   value={age}
                value={type ?? ""}
                onChange={handleChange}
                label="Type"
              >
                <MenuItem value={undefined}>All</MenuItem>
                <MenuItem value={"Outreach"}>Outreach</MenuItem>
                <MenuItem value={"Regular"}>Regular</MenuItem>
                <MenuItem value={"Social"}>Social</MenuItem>
                <MenuItem value={"Mentor"}>Mentor</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <DatePicker
              value={fromDate}
              label="From"
              onChange={(date) => {
                if (date) {
                  setFromDate(date);
                }
              }}
            />
            <DatePicker
              value={toDate}
              label="To"
              onChange={(date) => {
                if (date) {
                  setToDate(date);
                }
              }}
            />
          </Box>

          <List>
            {eventsQuery.data.map((event) => (
              <UpcomingEventListItem event={event} key={event.id} />
            ))}
          </List>
          {authStatusQuery.data?.isAdmin ? (
            <Button
              LinkComponent={LinkBehavior}
              href="/events/create"
              variant="contained"
            >
              Create Event
            </Button>
          ) : null}
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h4">Loading...</Typography>
    </Paper>
  );
}
