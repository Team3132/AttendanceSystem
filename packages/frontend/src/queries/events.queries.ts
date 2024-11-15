import { trpcClient } from "@/trpcClient";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { GetEventParamsSchema } from "@/api/schema";
import { z } from "zod";
import { eventQueryKeys } from "@/api/queryKeys";

type GetEventsParams = Omit<z.infer<typeof GetEventParamsSchema>, "cursor">;

export const eventQueryOptions = {
  eventList: (options: GetEventsParams) =>
    infiniteQueryOptions({
      queryFn: ({ pageParam }) =>
        trpcClient.events.getEvents.query({
          ...options,
          cursor: pageParam ?? undefined,
        }),
      queryKey: eventQueryKeys.eventsListParams(options),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: undefined as number | null | undefined,
    }),

  eventDetails: (id: string) =>
    queryOptions({
      queryFn: () => trpcClient.events.getEvent.query(id),
      queryKey: eventQueryKeys.eventDetails(id),
    }),

  eventSecret: (id: string) =>
    queryOptions({
      queryFn: () => trpcClient.events.getEventSecret.query(id),
      queryKey: eventQueryKeys.eventSecret(id),
    }),

  eventRsvp: (id: string) =>
    queryOptions({
      queryFn: () => trpcClient.events.getSelfEventRsvp.query(id),
      queryKey: eventQueryKeys.eventRsvp(id),
    }),

  eventRsvps: (id: string) =>
    queryOptions({
      queryFn: () => trpcClient.events.getEventRsvps.query(id),
      queryKey: eventQueryKeys.eventRsvps(id),
    }),
};
