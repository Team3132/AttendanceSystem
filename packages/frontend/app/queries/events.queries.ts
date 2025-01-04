import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { GetEventParamsSchema } from "@/api/schema";
import { z } from "zod";
import { eventQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import {
  mentorMiddleware,
  sessionMiddleware,
} from "@/middleware/authMiddleware";
import {
  getEvent,
  getEventRsvp,
  getEventRsvps,
  getEvents,
  getEventSecret,
} from "@/api/services/events.service";

type GetEventsParams = Omit<z.infer<typeof GetEventParamsSchema>, "cursor">;

const getEventsFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .validator(GetEventParamsSchema)
  .handler(async ({ data }) => getEvents(data));

const getEventFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .validator(z.string().describe("The event ID"))
  .handler(async ({ data }) => getEvent(data));

const getEventSecretFn = createServerFn({ method: "GET" })
  .middleware([mentorMiddleware])
  .validator(z.string().describe("The event ID"))
  .handler(async ({ data }) => getEventSecret(data));

const getSelfEventRsvpFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .validator(z.string().describe("The event ID"))
  .handler(async ({ data, context }) => getEventRsvp(data, context.user.id));

const getEventRsvpsFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .validator(z.string().describe("The event ID"))
  .handler(async ({ data }) => getEventRsvps(data));

const getUserRsvpFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .validator(
    z.object({
      eventId: z.string().describe("The event ID"),
      userId: z.string().describe("The user ID"),
    }),
  )
  .handler(async ({ data, context }) =>
    getEventRsvp(data.eventId, data.userId),
  );

export const eventQueryOptions = {
  eventList: (options: GetEventsParams) =>
    infiniteQueryOptions({
      queryFn: ({ pageParam }) =>
        getEventsFn({
          data: { ...options, cursor: pageParam ?? undefined },
        }),
      queryKey: eventQueryKeys.eventsListParams(options),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: undefined as number | null | undefined,
    }),

  eventDetails: (id: string) =>
    queryOptions({
      queryFn: () => getEventFn({ data: id }),
      queryKey: eventQueryKeys.eventDetails(id),
    }),

  eventSecret: (id: string) =>
    queryOptions({
      queryFn: () => getEventSecretFn({ data: id }),
      queryKey: eventQueryKeys.eventSecret(id),
    }),

  eventRsvp: (id: string) =>
    queryOptions({
      queryFn: () => getSelfEventRsvpFn({ data: id }),
      queryKey: eventQueryKeys.eventRsvp(id),
    }),

  eventRsvps: (id: string) =>
    queryOptions({
      queryFn: () => getEventRsvpsFn({ data: id }),
      queryKey: eventQueryKeys.eventRsvps(id),
    }),

  userRsvp: (eventId: string, userId: string) =>
    queryOptions({
      queryFn: () => getUserRsvpFn({ data: { eventId, userId } }),
      queryKey: eventQueryKeys.eventUserRsvp(eventId, userId),
    }),
};
