import { useQuery } from "@tanstack/react-query";
import eventApi from "../../../api/query/event.api";
import {
  Box,
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
import ErrorCard from "../../../components/ErrorCard";
import UpcomingEventListItem from "./UpcomingEventListItem";
import { DateTime } from "luxon";
import { useState } from "react";
import { CreateEventDto } from "../../../api/generated";

export default function UpcomingEventsCard() {
  const [fromDate] = useState(DateTime.local().toISODate() ?? undefined);
  const [toDate] = useState(
    DateTime.local().plus({ month: 1 }).toISODate() ?? undefined,
  );
  const [type, setType] = useState<CreateEventDto.type | undefined>();

  const eventsQuery = useQuery(
    eventApi.getEvents({
      take: 5,
      from: fromDate,
      to: toDate,
      type,
    }),
  );

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as CreateEventDto.type);
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
                <MenuItem value={CreateEventDto.type.OUTREACH}>
                  Outreach
                </MenuItem>
                <MenuItem value={CreateEventDto.type.REGULAR}>Regular</MenuItem>
                <MenuItem value={CreateEventDto.type.SOCIAL}>Social</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <List>
            {eventsQuery.data.map((event) => (
              <UpcomingEventListItem event={event} key={event.id} />
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
