import { queryOptions, QueryOptions } from "@tanstack/react-query";
import { eventService} from 'backend/services'
import { createServerFn } from '@tanstack/start'

const getSession = () => {
  const { session } = await lucia.validateSession(sessionId);
if (session && session.fresh) {
	// set session cookie
}

}

export const eventQueryKeys = {
  events: "events",
  event: (id: string) => ["event", id] as const, // The root event query key
  eventData: (id: string) => [...eventQueryKeys.event(id), "data"] as const, // The data for an event
  eventSecret: (id: string) => [...eventQueryKeys.event(id), "secret"] as const, // The secret for an event
  eventRsvps: (id: string) => [...eventQueryKeys.event(id), "rsvps"] as const, // All RSVPs for an event
  eventRsvp: (id: string) => [...eventQueryKeys.event(id), "rsvp"] as const, // The logged in user's RSVP
};

const getEvents = createServerFn('GET', async () => {


  eventService.getEvents({
    cursor: 0,
    limit: 10,

  })
})

export const eventQueries = {
  getEvent: (id: string) =>
    queryOptions({
      queryKey: eventQueryKeys.event(id),
      queryFn: async () => {
        return { id, name: "My Event" };
      },
    }),
};

