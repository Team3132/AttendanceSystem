import AsChildLink from "@/components/AsChildLink";
import DefaultAppBar from "@/components/DefaultAppBar";
import InfiniteList from "@/components/InfiniteList";
import UpcomingEventListItem from "@/features/events/components/UpcomingEventListItem";
import { trpc } from "@/trpcClient";
import {
  Box,
  Button,
  Container,
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
import { DatePicker } from "@mui/x-date-pickers";
import { createFileRoute } from "@tanstack/react-router";
import { EventTypeSchema } from "backend/schema";
import { DateTime } from "luxon";
import { z } from "zod";

const defaultTo = DateTime.now().plus({ month: 1 }).startOf("day").toISO();
const defaultFrom = DateTime.now().startOf("day").toISO();

const eventsSearchSchema = z.object({
  fromDate: z.string().datetime().optional().catch(defaultFrom),
  toDate: z.string().datetime().catch(defaultTo),
  type: z.union([EventTypeSchema, z.undefined()]).catch(undefined),
});

type EventsSearch = z.infer<typeof eventsSearchSchema>;

export const Route = createFileRoute("/_authenticated/events")({
  component: Component,
  validateSearch: (search) => eventsSearchSchema.parse(search),
  loaderDeps: ({ search: { fromDate, toDate, type } }) => ({
    fromDate,
    toDate,
    type,
  }),
  loader: async ({
    context: { queryUtils },
    deps: { fromDate, toDate, type },
  }) => {
    const authStatus = await queryUtils.auth.status.ensureData();

    const eventsList = await queryUtils.events.getEvents.prefetchInfinite({
      from: fromDate,
      to: toDate,
      type,
      limit: 5,
    });

    return {
      eventsList,
      authStatus,
    };
  },
});

function Component() {
  const { authStatus, eventsList } = Route.useLoaderData();
  const { fromDate, toDate, type } = Route.useSearch();
  const navigate = Route.useNavigate();

  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
    initialData: authStatus,
  });

  const infiniteEventsQuery = trpc.events.getEvents.useInfiniteQuery(
    {
      from: fromDate,
      to: toDate,
      type,
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  const handleTypeChange = (event: SelectChangeEvent) => {
    navigate({
      search: (prev) => ({
        ...prev,
        type: event.target.value as z.infer<typeof EventTypeSchema> | undefined,
      }),
    });
  };

  const handleStartChange = (date: DateTime<true> | DateTime<false> | null) => {
    const iso = date?.toISO();
    navigate({
      search: (prev) => ({ ...prev, fromDate: iso ? iso : defaultFrom }),
    });
  };

  const handleEndChange = (date: DateTime<true> | DateTime<false> | null) => {
    const iso = date?.toISO();
    navigate({
      search: (prev) => ({ ...prev, toDate: iso ? iso : defaultTo }),
    });
  };

  const startDateTime = fromDate ? DateTime.fromISO(fromDate) : undefined;
  const endDateTime = toDate ? DateTime.fromISO(toDate) : undefined;

  return (
    <>
      <DefaultAppBar title="Events" />
      <Container
        sx={{
          my: 2,
          flex: 1,
          overflowY: "auto",
          display: "flex",
        }}
      >
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
                  onChange={handleTypeChange}
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
                value={startDateTime}
                label="From"
                onChange={handleStartChange}
              />
              <DatePicker
                value={endDateTime}
                label="To"
                onChange={handleEndChange}
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
      </Container>
    </>
  );
}
