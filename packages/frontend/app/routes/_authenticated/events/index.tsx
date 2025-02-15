import InfiniteList from "@/components/InfiniteList";
import { LinkButton } from "@/components/LinkButton";
import { LinkListItemButton } from "@/components/LinkListItemButton";
import UpcomingEventListItem from "@/features/events/components/UpcomingEventListItem";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";
import { EventTypeSchema } from "@/server/schema";
import { Box, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  keepPreviousData,
  useInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { useCallback } from "react";
import { z } from "zod";

const defaultValues = {
  from: DateTime.now().toISODate(),
  type: undefined,
  limit: 10,
};

const eventsSearchSchema = z.object({
  from: z.string().default(defaultValues.from),
  type: EventTypeSchema.optional(),
  limit: z.number().default(defaultValues.limit),
});

export const Route = createFileRoute("/_authenticated/events/")({
  validateSearch: eventsSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultValues)],
  },
  beforeLoad: () => ({
    getTitle: () => "Events",
  }),
  loaderDeps: ({ search }) => search,

  loader: ({ context: { queryClient }, deps }) => {
    queryClient.prefetchQuery(authQueryOptions.status());

    queryClient.prefetchInfiniteQuery(eventQueryOptions.eventList(deps));
  },
  component: Component,
});

function Component() {
  return (
    <Stack gap={2} height={"100%"} flexDirection={"column"}>
      <EventFromSelector />
      <EventList />
      <CreateEventButton />
    </Stack>
  );
}

function EventFromSelector() {
  const { from } = Route.useSearch();

  const navigate = Route.useNavigate();

  const handleStartChange = useCallback(
    (date: DateTime<true> | DateTime<false> | null) => {
      const iso = date?.toISODate();
      navigate({
        search: (prev) => ({ ...prev, from: iso ?? defaultValues.from }),
      });
    },
    [navigate],
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <DatePicker
        value={DateTime.fromISO(from ?? defaultValues.from)}
        label="From"
        onChange={handleStartChange}
      />
    </Box>
  );
}

function EventList() {
  const { from, limit, type } = Route.useSearch();

  // This doesn't use suspense because we want to show the previous data while fetching new data
  const infiniteEventsQuery = useInfiniteQuery({
    ...eventQueryOptions.eventList({
      from,
      limit,
      type,
    }),
    placeholderData: keepPreviousData,
  });

  return (
    <InfiniteList
      data={infiniteEventsQuery.data}
      fetchNextPage={infiniteEventsQuery.fetchNextPage}
      isFetching={infiniteEventsQuery.isFetching}
      scrollRestorationId="events"
      renderRow={({ row, style, ref, index }) => (
        <LinkListItemButton
          ref={ref}
          key={index}
          to={"/events/$eventId"}
          params={{
            eventId: row.id,
          }}
          preloadDelay={500}
          style={style}
        >
          <UpcomingEventListItem event={row} />
        </LinkListItemButton>
      )}
      fixedHeight={72}
      sx={{
        flex: 1,
        overflowY: "auto",
      }}
    />
  );
}

function CreateEventButton() {
  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

  return authStatusQuery.data.isAdmin ? (
    <LinkButton to="/events/create" variant="contained">
      Create Event
    </LinkButton>
  ) : null;
}
