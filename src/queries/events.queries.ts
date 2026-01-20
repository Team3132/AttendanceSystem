import {
  adminMiddleware,
  sessionMiddleware,
} from "@/middleware/authMiddleware";
import { eventQueryKeys } from "@/server/queryKeys";
import type { GetEventParamsSchema } from "@/server/schema/GetEventParamsSchema";
import {
  getEvent,
  getEventRsvp,
  getEventRsvps,
  getEventSecret,
  getEvents,
} from "@/server/services/events.service";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type GetEventsParams = Omit<z.infer<typeof GetEventParamsSchema>, "cursor">;

const getEventFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .inputValidator(z.string().describe("The event ID"))
  .handler(async ({ data, context }) => getEvent(context, data));

const getEventSecretFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .inputValidator(z.string().describe("The event ID"))
  .handler(async ({ data, context }) => getEventSecret(context, data));

const getSelfEventRsvpFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .inputValidator(z.string().describe("The event ID"))
  .handler(async ({ data, context }) =>
    getEventRsvp(context, data, context.user.id),
  );

const getEventRsvpsFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .inputValidator(z.string().describe("The event ID"))
  .handler(async ({ data, context }) => getEventRsvps(context, data));

const getUserRsvpFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .inputValidator(
    z.object({
      eventId: z.string().describe("The event ID"),
      userId: z.string().describe("The user ID"),
    }),
  )
  .handler(async ({ data, context }) =>
    getEventRsvp(context, data.eventId, data.userId),
  );

export const eventQueryOptions = {
  eventList: (options: GetEventsParams) =>
    infiniteQueryOptions({
      queryFn: ({ pageParam, signal }) =>
        getEvents({
          data: { ...options, cursor: pageParam ?? undefined },
          signal,
        }),
      queryKey: eventQueryKeys.eventsListParams(options),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: undefined as number | null | undefined,
    }),

  eventDetails: (id: string) =>
    queryOptions({
      queryFn: ({ signal }) => getEventFn({ data: id, signal }),
      queryKey: eventQueryKeys.eventDetails(id),
    }),

  eventSecret: (id: string) =>
    queryOptions({
      queryFn: ({ signal }) => getEventSecretFn({ data: id, signal }),
      queryKey: eventQueryKeys.eventSecret(id),
    }),

  eventRsvp: (id: string) =>
    queryOptions({
      queryFn: ({ signal }) => getSelfEventRsvpFn({ data: id, signal }),
      queryKey: eventQueryKeys.eventRsvp(id),
    }),

  eventRsvps: (id: string) =>
    queryOptions({
      queryFn: ({ signal }) => getEventRsvpsFn({ data: id, signal }),
      queryKey: eventQueryKeys.eventRsvps(id),
    }),

  userRsvp: (eventId: string, userId: string) =>
    queryOptions({
      queryFn: ({ signal }) =>
        getUserRsvpFn({ data: { eventId, userId }, signal }),
      queryKey: eventQueryKeys.eventUserRsvp(eventId, userId),
    }),
};
