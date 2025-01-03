import AsChildLink from "@/components/AsChildLink";
import DefaultAppBar from "@/components/DefaultAppBar";
import InfiniteList from "@/components/InfiniteList";
import UpcomingEventListItem from "@/features/events/components/UpcomingEventListItem";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";
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
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useLocation,
  useSearch,
} from "@tanstack/react-router";
import { EventTypeSchema } from "@/api/schema";
import { DateTime } from "luxon";
import { z } from "zod";

const defaultTo = DateTime.now().plus({ month: 1 }).startOf("day").toISODate();
const defaultFrom = DateTime.now().startOf("day").toISODate();
const defaultLimit = 5;

const eventsSearchSchema = z.object({
  from: z.string().date().optional().catch(defaultFrom),
  to: z.string().date().optional().catch(defaultTo),
  type: EventTypeSchema.optional().catch(undefined),
  limit: z.number().optional().catch(defaultLimit),
});

type EventsSearch = z.infer<typeof eventsSearchSchema>;

export const Route = createFileRoute("/_authenticated/events")({
  component: Component,
  validateSearch: (search) => eventsSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({
    context: { queryClient },
    deps: { from = defaultFrom, to = defaultTo, type, limit = defaultLimit },
  }) => {
    const authStatus = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );

    await queryClient.prefetchInfiniteQuery(
      eventQueryOptions.eventList({
        from,
        to,
        type,
        limit,
      }),
    );

    return {
      authStatus,
    };
  },
});

function Component() {
  const { authStatus } = Route.useLoaderData();
  const {
    from = defaultFrom,
    to = defaultTo,
    type,
    limit = defaultLimit,
  } = useLocation({ select: (s) => s.search });
  const navigate = Route.useNavigate();

  const authStatusQuery = useQuery({
    ...authQueryOptions.status(),
    initialData: authStatus,
  });

  const infiniteEventsQuery = useInfiniteQuery(
    eventQueryOptions.eventList({
      from,
      to,
      type,
      limit,
    }),
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
    const iso = date?.toISODate();
    navigate({
      search: (prev) => ({ ...prev, from: iso ? iso : defaultFrom }),
    });
  };

  const handleEndChange = (date: DateTime<true> | DateTime<false> | null) => {
    const iso = date?.toISODate();
    navigate({
      search: (prev) => ({ ...prev, to: iso ? iso : defaultTo }),
    });
  };

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
                value={DateTime.fromISO(from ?? defaultFrom)}
                label="From"
                onChange={handleStartChange}
              />
              <DatePicker
                value={DateTime.fromISO(to ?? defaultTo)}
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
