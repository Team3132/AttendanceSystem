import { useState } from "react";
import {
  ApiError,
  CreateEventDto,
  EventResponseType,
  Rsvp,
  ScaninDto,
  UpdateEventDto,
  UpdateOrCreateRSVP,
  UpdateRangeRSVP,
} from "../generated";
import { useAuthStatus } from "../hooks";
import { DateTime } from "luxon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/client";
import { queryClient } from "@/main";

export const useEvents = (take?: number, from?: DateTime, to?: DateTime) => {
  const { isAuthenticated } = useAuthStatus();

  const { data: eventData, error: userError } = useQuery({
    queryFn: () => api.event.getEvents(from?.toISO(), to?.toISO(), take),
    enabled: !!isAuthenticated,
    queryKey: ["Events", from?.toISO(), to?.toISO(), take],
  });

  return {
    events: eventData,
    isLoading: !userError && !eventData,
    isError: userError,
  };
};

export const useEvent = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const { data: eventData, error: userError } = useQuery({
    queryFn: () => api.event.getEvent(eventId!),
    enabled: !!eventId && isAuthenticated,
    queryKey: ["Event", eventId],
  });

  return {
    event: eventData,
    isLoading: !userError && !eventData,
    isError: userError,
  };
};

export const useUpdateEvent = () => {
  return useMutation<
    EventResponseType,
    ApiError,
    { id: string; data: UpdateEventDto }
  >({
    mutationFn: ({ id, data }) => api.event.updateEvent(id, data),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(["Event", id], data);
      queryClient.invalidateQueries(["Events"]);
    },
  });
};

export const useEventRSVPStatus = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const { data: rsvpData, error: rsvpError } = useQuery({
    queryFn: () => api.event.getEventRsvp(eventId!),
    queryKey: ["EventRSVP", eventId],
    enabled: !!eventId,
  });

  return {
    rsvp: rsvpData,
    isLoading: !rsvpError && !rsvpData,
    isError: rsvpError,
  };
};

export const useUpdateEventRSVPStatus = () => {
  return useMutation<
    Rsvp,
    ApiError,
    { eventId: string; rsvp: UpdateOrCreateRSVP }
  >({
    mutationFn: ({ eventId, rsvp }) => api.event.setEventRsvp(eventId, rsvp),
    onSuccess: (data, { eventId }) => {
      queryClient.setQueryData(["EventRSVP", eventId], data);
      queryClient.invalidateQueries(["EventRsvps", eventId]);
    },
  });
};

export const useUpdateEventsRSVPStatus = () => {
  return useMutation<Rsvp[], ApiError, UpdateRangeRSVP>({
    mutationFn: (data) => api.event.updateEventRsvpRange(data),
    onSuccess: (data) => {
      data.map((rsvp) => {
        queryClient.setQueryData(["EventRSVP", rsvp.eventId], rsvp);
        queryClient.invalidateQueries(["EventRsvps", rsvp.eventId]);
      });
    },
  });
};

export const useDeleteEvent = () => {
  return useMutation<EventResponseType, ApiError, string>({
    mutationFn: (id) => api.event.deleteEvent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries(["Events"]);
      queryClient.invalidateQueries(["Event", id]);
    },
  });
};

export const useCreateEvent = () => {
  return useMutation<EventResponseType, ApiError, CreateEventDto>({
    mutationFn: (data) => api.event.createEvent(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Events"]);
    },
  });
};

export const useEventRSVPStatuses = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const { data: rsvpData, error: rsvpError } = useQuery({
    queryFn: () => api.event.getEventRsvps(eventId!),
    enabled: !!eventId,
    queryKey: ["EventRsvps", eventId],
  });

  return {
    rsvps: rsvpData,
    isLoading: !rsvpError && !rsvpData,
    isError: rsvpError,
  };
};

export const useScanin = () => {
  return useMutation<Rsvp, ApiError, { eventId: string; scan: ScaninDto }>(
    ({ eventId, scan }) => api.event.scaninEvent(eventId, scan),
    {
      onSuccess: (data, { eventId }) => {
        queryClient.invalidateQueries(["EventRsvps", eventId]);
      },
    }
  );
};
