import AsChildLink from "@/components/AsChildLink";
import InfiniteList from "@/components/InfiniteList";
import { trpc } from "@/trpcClient";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  ListItemButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { EventTypeSchema } from "backend/schema";
import { AuthStatusSchema } from "backend/schema";
import { DateTime } from "luxon";
import { useState } from "react";
import { z } from "zod";
import UpcomingEventListItem from "./UpcomingEventListItem";

interface UpcomingEventsCardProps {
  initialAuthStatus: z.infer<typeof AuthStatusSchema>;
}

export default function UpcomingEventsCard(props: UpcomingEventsCardProps) {
  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
    initialData: props.initialAuthStatus,
  });

  const [fromDate, setFromDate] = useState(DateTime.now().startOf("day"));
  const [toDate, setToDate] = useState(
    DateTime.now().plus({ month: 1 }).startOf("day"),
  );

  const [type, setType] = useState<
    z.infer<typeof EventTypeSchema> | undefined
  >();

  const infiniteEventsQuery = trpc.events.getEvents.useInfiniteQuery(
    {
      from: fromDate.toISO() ?? undefined,
      to: toDate.toISO() ?? undefined,
      type,
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as z.infer<typeof EventTypeSchema>);
  };

  if (infiniteEventsQuery.data) {
    return (
      <Paper sx={{ height: "100%", p: 2, width: "100%" }}>
        <Stack
          gap={2}
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          width={"100%"}
        >
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
          <InfiniteList
            data={infiniteEventsQuery.data}
            fetchNextPage={infiniteEventsQuery.fetchNextPage}
            isFetching={infiniteEventsQuery.isFetching}
            renderRow={({ key, row, style }) => (
              <AsChildLink
                key={key}
                to={"/events/$eventId"}
                params={{
                  eventId: row.id,
                }}
              >
                <ListItemButton style={style}>
                  <UpcomingEventListItem event={row} />
                </ListItemButton>
              </AsChildLink>
            )}
            fixedHeight={72}
            sx={{
              flex: 1,
              // height: "100px",
              // flexGrow: 1,
              overflowY: "auto",
            }}
          />
          {authStatusQuery.data?.isAdmin ? (
            <AsChildLink to="/events/create">
              <Button variant="contained">Create Event</Button>
            </AsChildLink>
          ) : null}
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height: "100%", p: 2, width: "100%" }}>
      <Typography variant="h4">Loading...</Typography>
    </Paper>
  );
}
