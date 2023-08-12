import { queryOptions } from "@tanstack/react-query";
import api from "..";
import { cancelableQuery, mutationOptions } from "./utils";
import {
  CreateEventDto,
  ScaninDto,
  TokenCheckinDto,
  UpdateEventDto,
  UpdateOrCreateRSVP,
} from "../generated";

interface GetEventParams {
  from?: string;
  to?: string;
  take?: number;
  type?: CreateEventDto.type;
}

interface EditEventData extends UpdateEventDto {
  eventId: string;
}

interface RsvpToEventData extends UpdateOrCreateRSVP {
  eventId: string;
}

interface ScanIntoEventData extends TokenCheckinDto {
  eventId: string;
}

interface ScanInData extends ScaninDto {
  eventId: string;
}

export const eventKeys = {
  root: ["event" as const] as const,
  events: (params: GetEventParams = {}) =>
    [...eventKeys.root, "events", params] as const,
  event: (eventId: string) => [...eventKeys.root, "event", eventId] as const,
  eventSecret: (eventId: string) =>
    [...eventKeys.event(eventId), "secret"] as const,
  eventRsvp: (eventId: string) =>
    [...eventKeys.event(eventId), "rsvp"] as const,
  eventRsvps: (eventId: string) =>
    [...eventKeys.event(eventId), "rsvps"] as const,
};

const eventApi = {
  getEvents: (params: GetEventParams = {}) =>
    queryOptions({
      queryKey: eventKeys.events(params),
      queryFn: ({ signal }) =>
        cancelableQuery(
          api.event.getEvents(params.from, params.to, params.take, params.type),
          signal
        ),
    }),
  getEvent: (eventId: string) =>
    queryOptions({
      queryKey: eventKeys.event(eventId),
      queryFn: ({ signal }) =>
        cancelableQuery(api.event.getEvent(eventId), signal),
    }),
  getEventSecret: (eventId: string) =>
    queryOptions({
      queryKey: eventKeys.eventSecret(eventId),
      queryFn: ({ signal }) =>
        cancelableQuery(api.event.getEventSecret(eventId), signal),
    }),
  getEventRsvp: (eventId: string) =>
    queryOptions({
      queryKey: eventKeys.eventRsvp(eventId),
      queryFn: ({ signal }) =>
        cancelableQuery(api.event.getEventRsvp(eventId), signal),
    }),
  getEventRsvps: (eventId: string) =>
    queryOptions({
      queryKey: eventKeys.eventRsvps(eventId),
      queryFn: ({ signal }) =>
        cancelableQuery(api.event.getEventRsvps(eventId), signal),
    }),

  createEvent: mutationOptions({
    mutationFn: (data: CreateEventDto) => api.event.createEvent(data),
  }),
  editEvent: mutationOptions({
    mutationFn: ({ eventId, ...data }: EditEventData) =>
      api.event.updateEvent(eventId, data),
  }),
  deleteEvent: mutationOptions({
    mutationFn: (eventId: string) => api.event.deleteEvent(eventId),
  }),
  setEventRsvp: mutationOptions({
    mutationFn: ({ eventId, ...data }: RsvpToEventData) =>
      api.event.setEventRsvp(eventId, data),
  }),
  scanInToEvent: mutationOptions({
    mutationFn: ({ eventId, ...data }: ScanIntoEventData) =>
      api.event.scanintoEvent(eventId, data),
  }),
  scanInEvent: mutationOptions({
    mutationFn: ({ eventId, ...data }: ScanInData) =>
      api.event.scaninEvent(eventId, data),
  }),
  checkoutFromEvent: mutationOptions({
    mutationFn: ({
      eventId,
      userId = "me",
    }: {
      eventId: string;
      userId?: string;
    }) => api.event.checkoutUser1(eventId, userId),
  }),
};

export default eventApi;
