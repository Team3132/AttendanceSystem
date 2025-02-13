import AsChildLink from "@/components/AsChildLink";
import InfiniteList from "@/components/InfiniteList";
import { LinkButton } from "@/components/LinkButton";
import UpcomingEventListItem from "@/features/events/components/UpcomingEventListItem";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";
import { EventTypeSchema } from "@/server/schema";
import { Box, ListItemButton, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { useCallback } from "react";
import { z } from "zod";

const defaultValues = {
  from: DateTime.now().toISODate(),
  type: undefined,
  limit: 5,
};

const eventsSearchSchema = z.object({
  from: z.string().default(defaultValues.from),
  type: EventTypeSchema.optional(),
  limit: z.number().default(defaultValues.limit),
});

export const Route = createFileRoute("/_authenticated/events")({
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
  const { from, limit, type } = Route.useSearch();

  const navigate = Route.useNavigate();

  const infiniteEventsQuery = useSuspenseInfiniteQuery(
    eventQueryOptions.eventList({
      from,
      limit,
      type,
    }),
  );

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
    <Stack gap={2} height={"100%"} flexDirection={"column"}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <DatePicker
          value={DateTime.fromISO(from ?? defaultValues.from)}
          label="From"
          onChange={handleStartChange}
        />
      </Box>
      <InfiniteList
        data={infiniteEventsQuery.data}
        fetchNextPage={infiniteEventsQuery.fetchNextPage}
        isFetching={infiniteEventsQuery.isFetching}
        scrollRestorationId="events"
        renderRow={({ row, style, ref, index }) => (
          <AsChildLink
            key={index}
            to={"/events/$eventId"}
            params={{
              eventId: row.id,
            }}
          >
            <ListItemButton style={style} ref={ref} data-index={index}>
              <UpcomingEventListItem event={row} />
            </ListItemButton>
          </AsChildLink>
        )}
        fixedHeight={72}
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      />
      <CreateEventButton />
    </Stack>
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
