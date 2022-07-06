import useSWR from "swr";
import { Attendance, AuthStatusDto, Event, Rsvp } from "../generated";

export const useEvents = () => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const {
    data: eventData,
    error: userError,
    mutate,
  } = useSWR<Event[]>(authData?.isAuthenticated ? `/api/event` : null);
  return {
    events: eventData,
    isLoading: (!userError || !authError) && (!eventData || !authData),
    isError: userError,
    mutate,
  };
};

export const useEvent = (eventId?: string) => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const {
    data: eventData,
    error: userError,
    mutate,
  } = useSWR<Event>(
    authData?.isAuthenticated
      ? eventId
        ? `/api/event/${eventId}`
        : null
      : null
  );

  return {
    event: eventData,
    isLoading: (!userError || !authError) && (!eventData || !authData),
    isError: userError,
    mutate,
  };
};

export const useEventRSVPStatus = (eventId?: string) => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const {
    data: rsvpData,
    error: rsvpError,
    mutate,
  } = useSWR<Rsvp>(
    authData?.isAuthenticated
      ? eventId
        ? `/api/event/${eventId}/rsvp`
        : null
      : null
  );

  return {
    rsvp: rsvpData,
    isLoading: (!rsvpError || !authError) && (!rsvpData || !authData),
    isError: rsvpError,
    mutate,
  };
};

export const useEventRSVPStatuses = (eventId?: string) => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const {
    data: rsvpData,
    error: rsvpError,
    mutate,
  } = useSWR<Rsvp[]>(
    authData?.isAuthenticated
      ? eventId
        ? `/api/event/${eventId}/rsvps`
        : null
      : null
  );

  return {
    rsvps: rsvpData,
    isLoading: (!rsvpError || !authError) && (!rsvpData || !authData),
    isError: rsvpError,
    mutate,
  };
};

export const useEventAttendanceStatus = (eventId?: string) => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const {
    data: attendanceData,
    error: attendanceError,
    mutate,
  } = useSWR<Attendance>(
    authData?.isAuthenticated
      ? eventId
        ? `/api/event/${eventId}/attendance`
        : null
      : null
  );

  return {
    attendance: attendanceData,
    isLoading:
      (!attendanceError || !authError) && (!attendanceData || !authData),
    isError: attendanceError,
    mutate,
  };
};

export const useEventAttendanceStatuses = (eventId?: string) => {
  const { data: authData, error: authError } =
    useSWR<AuthStatusDto>(`/api/auth/status`);

  const {
    data: attendanceData,
    error: attendanceError,
    mutate,
  } = useSWR<Attendance[]>(
    authData?.isAuthenticated
      ? eventId
        ? `/api/event/${eventId}/attendances`
        : null
      : null
  );

  return {
    attendances: attendanceData,
    isLoading:
      (!attendanceError || !authError) && (!attendanceData || !authData),
    isError: attendanceError,
    mutate,
  };
};
