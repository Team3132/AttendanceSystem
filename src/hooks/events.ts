import { useState } from "react";
import useSWR from "swr";
import { Attendance, Event, Rsvp } from "@generated";
import { useAuthStatus } from "@hooks";

export const useEvents = (take?: number, from?: Date, to?: Date) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: eventData,
    error: userError,
    mutate,
  } = useSWR<Event[]>(
    isAuthenticated && from && to ? [`/api/event`, { take, from, to }] : null
  );

  return {
    events: eventData,
    isLoading: !userError && !eventData,
    isError: userError,
    mutate,
  };
};

export const useEvent = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: eventData,
    error: userError,
    mutate,
  } = useSWR<Event>(
    isAuthenticated ? (eventId ? `/api/event/${eventId}` : null) : null
  );

  return {
    event: eventData,
    isLoading: !userError && !eventData,
    isError: userError,
    mutate,
  };
};

export const useEventRSVPStatus = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: rsvpData,
    error: rsvpError,
    mutate,
  } = useSWR<Rsvp>(
    isAuthenticated ? (eventId ? `/api/event/${eventId}/rsvp` : null) : null
  );

  return {
    rsvp: rsvpData,
    isLoading: !rsvpError && !rsvpData,
    isError: rsvpError,
    mutate,
  };
};

export const useEventRSVPStatuses = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: rsvpData,
    error: rsvpError,
    mutate,
  } = useSWR<Rsvp[]>(
    isAuthenticated ? (eventId ? `/api/event/${eventId}/rsvps` : null) : null
  );

  return {
    rsvps: rsvpData,
    isLoading: !rsvpError && !rsvpData,
    isError: rsvpError,
    mutate,
  };
};

export const useEventAttendanceStatus = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: attendanceData,
    error: attendanceError,
    mutate,
  } = useSWR<Attendance>(
    isAuthenticated
      ? eventId
        ? `/api/event/${eventId}/attendance`
        : null
      : null
  );

  return {
    attendance: attendanceData,
    isLoading: !attendanceError && !attendanceData,
    isError: attendanceError,
    mutate,
  };
};

export const useEventAttendanceStatuses = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: attendanceData,
    error: attendanceError,
    mutate,
  } = useSWR<Attendance[]>(
    isAuthenticated
      ? eventId
        ? `/api/event/${eventId}/attendances`
        : null
      : null
  );

  return {
    attendances: attendanceData,
    isLoading: !attendanceError && !attendanceData,
    isError: attendanceError,
    mutate,
  };
};
