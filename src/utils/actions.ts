import axios, { AxiosResponse } from "axios";
import {
  Attendance,
  CreateEventDto,
  Event,
  Rsvp,
  UpdateEventDto,
  UpdateUserDto,
  User,
} from "../generated";

export const updateEvent = async (id: Event["id"], data: UpdateEventDto) => {
  const response = await axios.patch<Event>(`/api/event/${id}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const createEvent = async (data: CreateEventDto) => {
  const response = await axios.post<Event>(`/api/event`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteEvent = async (id: Event["id"]) => {
  const response = await axios.delete<Event>(`/api/event/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const setEventRSVPStatus = async (
  id: Event["id"],
  status: Rsvp["status"]
) => {
  const response = await axios.post<Rsvp>(`/api/event/${id}/rsvp`, {
    status,
  });
  return response.data;
};

export const setEventAttendanceStatus = async (
  id: Event["id"],
  status: Attendance["status"]
) => {
  const response = await axios.post<Attendance>(`/api/event/${id}/rsvp`, {
    status,
  });
  return response.data;
};

export const editUser = async (
  id: User["id"] | "me" = "me",
  data: UpdateUserDto
) => {
  const response = await axios.patch<User>(`/api/user/${id}`, data);
  return response.data;
};

export const logout = () => axios.get(`/api/auth/logout`);
