import {
  Box,
  Button,
  FormControl,
  InputLabel,
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
import { EventTypeSchema, PagedEventsSchema } from "backend/schema";
import { AuthStatusSchema } from "backend/schema";
import { InfiniteData } from "@tanstack/react-query";
import InfiniteList from "@/components/InfiniteList";

interface UpcomingEventsCardProps {
  initialAuthStatus: z.infer<typeof AuthStatusSchema>;
  initialEvents: InfiniteData<
    z.infer<typeof PagedEventsSchema>,
    string | null | undefined
  >;
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

  // const eventsQuery = trpc.events.getEvents.useQuery(
  //   {
  //     take: 5,
  //     from: fromDate.toISO() ?? undefined,
  //     to: toDate.toISO() ?? undefined,
  //     type,
  //   },
  //   {
  //     initialData: props.initialEvents,
  //   }
  // );
  const infiniteEventsQuery = trpc.events.getEvents.useInfiniteQuery(
    {
      limit: 10,
      from: fromDate.toISO() ?? undefined,
      to: toDate.toISO() ?? undefined,
      type,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      // initialData: props.initialEvents,
    }
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
            ListItemProps={(event) => ({
              LinkComponent: LinkBehavior,
              href: `/events/${event.id}`,
            })}
            fetchNextPage={infiniteEventsQuery.fetchNextPage}
            isFetching={infiniteEventsQuery.isFetching}
            renderRow={(event) => <UpcomingEventListItem event={event} />}
            fixedHeight={72}
            sx={{
              flex: 1,
              // height: "100px",
              // flexGrow: 1,
              overflowY: "auto",
            }}
          />

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
    <Paper sx={{ height: "100%", p: 2, width: "100%" }}>
      <Typography variant="h4">Loading...</Typography>
    </Paper>
  );
}
