import { useState } from "react";
import useSWR from "swr";
import { Attendance, Event, Rsvp } from "../generated";
import { useAuthStatus } from "../hooks";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/client";

export const useEvents = (take?: number, from?: DateTime, to?: DateTime) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: eventData,
    error: userError,
  } = useQuery({queryFn: () => api.event.eventControllerFindAll( from?.toISO(), to?.toISO(), take) })
  // const {
  //   data: eventData,
  //   error: userError,
  //   mutate,
  // } = useSWR<Event[]>(
  //   isAuthenticated && from && to
  //     ? [`/event`, { take, from: from.toISO(), to: to.toISO() }]
  //     : null
  // );

  return {
    events: eventData,
    isLoading: !userError && !eventData,
    isError: userError,
  };
};

export const useEvent = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: eventData,
    error: userError,
  } = useQuery({queryFn: () => api.event.eventControllerFindOne(eventId!), enabled: !!eventId && isAuthenticated})
  // const {
  //   data: eventData,
  //   error: userError,
  //   mutate,
  // } = useSWR<Event>(
  //   isAuthenticated ? (eventId ? `/event/${eventId}` : null) : null
  // );

  return {
    event: eventData,
    isLoading: !userError && !eventData,
    isError: userError,
  };
};

export const useEventRSVPStatus = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: rsvpData,
    error: rsvpError,
    mutate,
  } = useSWR<Rsvp>(
    isAuthenticated ? (eventId ? `/event/${eventId}/rsvp` : null) : null
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
    isAuthenticated ? (eventId ? `/event/${eventId}/rsvps` : null) : null
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
  } = useQuery({queryFn: () => api.event.eventControllerGetEventAttendance(eventId!), enabled: isAuthenticated && !!eventId})
  // const {
  //   data: attendanceData,
  //   error: attendanceError,
  //   mutate,
  // } = useSWR<Attendance>(
  //   isAuthenticated ? (eventId ? `/event/${eventId}/attendance` : null) : null
  // );



  return {
    attendance: attendanceData,
    isLoading: !attendanceError && !attendanceData,
    isError: attendanceError,
  };
};

export const useEventAttendanceStatuses = (eventId?: string) => {
  const { isAuthenticated } = useAuthStatus();

  const {
    data: attendanceData,
    error: attendanceError,
  } = useQuery({queryFn: () => api.event.eventControllerGetEventAttendances(eventId!), enabled: !!eventId && isAuthenticated})
  // const {
  //   data: attendanceData,
  //   error: attendanceError,
  //   mutate,
  // } = useSWR<Attendance[]>(
  //   isAuthenticated ? (eventId ? `/event/${eventId}/attendances` : null) : null
  // );

  return {
    attendances: attendanceData,
    isLoading: !attendanceError && !attendanceData,
    isError: attendanceError,
  };
};
