import { useState } from "react";
import {
  ApiError,
  Attendance,
  CreateEventDto,
  Event,
  Rsvp,
  ScaninDto,
  UpdateEventDto,
  UpdateOrCreateAttendance,
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
    queryFn: () =>
      api.event.eventControllerFindAll(from?.toISO(), to?.toISO(), take),
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
    queryFn: () => api.event.eventControllerFindOne(eventId!),
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
  return useMutation<Event, ApiError, { id: string; data: UpdateEventDto }>({
    mutationFn: ({ id, data }) => api.event.eventControllerUpdate(id, data),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(["Event", id], data);
      queryClient.invalidateQueries(["Events"]);
    },
  });
};

export const useEventRSVPStatus = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const { data: rsvpData, error: rsvpError } = useQuery({
    queryFn: () => api.event.eventControllerGetEventRsvp(eventId!),
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
    mutationFn: ({ eventId, rsvp }) =>
      api.event.eventControllerSetEventRsvp(eventId, rsvp),
    onSuccess: (data, { eventId }) => {
      queryClient.setQueryData(["EventRSVP", eventId], data);
      queryClient.invalidateQueries(["EventRsvps", eventId]);
    },
  });
};

export const useUpdateEventsRSVPStatus = () => {
  return useMutation<Rsvp[], ApiError, UpdateRangeRSVP>({
    mutationFn: (data) => api.event.eventControllerSetEventsRsvp(data),
    onSuccess: (data) => {
      data.map((rsvp) => {
        queryClient.setQueryData(["EventRSVP", rsvp.eventId], rsvp);
        queryClient.invalidateQueries(["EventRsvps", rsvp.eventId]);
      });
    },
  });
};

export const useDeleteEvent = () => {
  return useMutation<Event, ApiError, string>({
    mutationFn: (id) => api.event.eventControllerRemove(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries(["Events"]);
      queryClient.invalidateQueries(["Event", id]);
    },
  });
};

export const useCreateEvent = () => {
  return useMutation<Event, ApiError, CreateEventDto>({
    mutationFn: (data) => api.event.eventControllerCreate(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["Events"]);
    },
  });
};

export const useEventRSVPStatuses = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const { data: rsvpData, error: rsvpError } = useQuery({
    queryFn: () => api.event.eventControllerGetEventRsvps(eventId!),
    enabled: !!eventId,
    queryKey: ["EventRsvps", eventId],
  });

  return {
    rsvps: rsvpData,
    isLoading: !rsvpError && !rsvpData,
    isError: rsvpError,
  };
};

export const useEventAttendanceStatus = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const { data: attendanceData, error: attendanceError } = useQuery({
    queryFn: () => api.event.eventControllerGetEventAttendance(eventId!),
    enabled: isAuthenticated && !!eventId,
    queryKey: ["EventAttendance", eventId],
  });

  return {
    attendance: attendanceData,
    isLoading: !attendanceError && !attendanceData,
    isError: attendanceError,
  };
};

export const useUpdateEventAttendanceStatus = () => {
  return useMutation<
    Attendance,
    ApiError,
    { eventId: string; attendance: UpdateOrCreateAttendance }
  >({
    mutationFn: ({ eventId, attendance }) =>
      api.event.eventControllerSetEventAttendance(eventId, attendance),
    onSuccess: (data, { eventId, attendance }) => {
      queryClient.setQueryData(["EventAttendance", eventId], data);
      queryClient.invalidateQueries(["EventAttendances", eventId]);
    },
  });
};

export const useEventAttendanceStatuses = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const { data: attendanceData, error: attendanceError } = useQuery({
    queryFn: () => api.event.eventControllerGetEventAttendances(eventId!),
    enabled: !!eventId && isAuthenticated,
    queryKey: ["EventAttendances", eventId],
  });

  return {
    attendances: attendanceData,
    isLoading: !attendanceError && !attendanceData,
    isError: attendanceError,
  };
};

export const useScanin = () => {
  return useMutation<
    Attendance,
    ApiError,
    { eventId: string; scan: ScaninDto }
  >(
    ({ eventId, scan }) => api.event.eventControllerScaninEvent(eventId, scan),
    {
      onSuccess: (data, { eventId }) => {
        queryClient.invalidateQueries(["EventAttendances", eventId]);
      },
    }
  );
};
