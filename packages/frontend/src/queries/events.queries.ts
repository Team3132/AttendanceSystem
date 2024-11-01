import { proxyClient } from "@/trpcClient";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { GetEventParamsSchema } from "backend/schema";
import { z } from "zod";

type GetEventsParams = Omit<z.infer<typeof GetEventParamsSchema>, "cursor">;

export const eventQueryKeys = {
  events: ["events"] as const,
  eventsList: ["events", "list"] as const,
  /** The events list */
  eventsListParams: (options: GetEventsParams) =>
    [...eventQueryKeys.eventsList, options] as const,
  /** The referenced event descriminator */
  event: (id: string) => [...eventQueryKeys.events, id] as const,
  /** The details of the event */
  eventDetails: (id: string) =>
    [...eventQueryKeys.event(id), "details"] as const,
  eventSecret: (id: string) => [...eventQueryKeys.event(id), "secret"] as const,
  /* The logged in user's rsvp status **/
  eventRsvp: (id: string) => [...eventQueryKeys.event(id), "rsvp"] as const,
  /** The RSVPs for everyone for a specific event */
  eventRsvps: (id: string) =>
    [...eventQueryKeys.eventRsvp(id), "list"] as const,
};

export const eventQueryOptions = {
  eventList: (options: GetEventsParams) =>
    infiniteQueryOptions({
      queryFn: ({ pageParam }) =>
        proxyClient.events.getEvents.query({
          ...options,
          cursor: pageParam ?? undefined,
        }),
      queryKey: eventQueryKeys.eventsListParams(options),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: undefined as number | null | undefined,
    }),

  eventDetails: (id: string) =>
    queryOptions({
      queryFn: () => proxyClient.events.getEvent.query(id),
      queryKey: eventQueryKeys.eventDetails(id),
    }),

  eventSecret: (id: string) =>
    queryOptions({
      queryFn: () => proxyClient.events.getEventSecret.query(id),
      queryKey: eventQueryKeys.eventSecret(id),
    }),

  eventRsvp: (id: string) =>
    queryOptions({
      queryFn: () => proxyClient.events.getSelfEventRsvp.query(id),
      queryKey: eventQueryKeys.eventRsvp(id),
    }),

  eventRsvps: (id: string) =>
    queryOptions({
      queryFn: () => proxyClient.events.getEventRsvps.query(id),
      queryKey: eventQueryKeys.eventRsvps(id),
    }),
};
