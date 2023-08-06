import { queryOptions } from "@tanstack/react-query";
import { cancelableQuery, mutationOptions } from "./utils";
import api from "..";
import { CreateScancodeDto, RsvpEvent, UpdateUserDto } from "../generated";

interface UserEditData extends UpdateUserDto {
  userId?: string;
}

interface CreateScancodeData extends CreateScancodeDto {
  userId?: string;
}

interface DeleteScancodeData {
  userId?: string;
  scancodeId: string;
}

export const userKeys = {
  root: ["user" as const] as const,
  user: (userId: string = "me") => ["user", userId] as const,
  users: ["users" as const] as const,
  details: (userId: string = "me") =>
    [...userKeys.user(userId), "details"] as const,
  userAvatar: (userId: string = "me") =>
    [...userKeys.user(userId), "avatar"] as const,
  userScancodes: (userId: string = "me") =>
    [...userKeys.user(userId), "scancodes"] as const,
  pendingRsvps: (userId: string = "me") =>
    [...userKeys.user(userId), "pendingRsvps"] as const,
};

const userApi = {
  getUser: (userId: string = "me") =>
    queryOptions({
      queryKey: userKeys.details(userId),
      queryFn: ({ signal }) =>
        cancelableQuery(api.user.getUser(userId), signal),
    }),
  getUserAvatar: (userId: string = "me") =>
    queryOptions({
      queryKey: userKeys.userAvatar(userId),
      queryFn: ({ signal }) =>
        cancelableQuery(api.user.getUserAvatar(userId), signal),
    }),
  getUserScancodes: (userId: string = "me") =>
    queryOptions({
      queryKey: userKeys.userScancodes(userId),
      queryFn: ({ signal }) =>
        cancelableQuery(api.user.getUserScancodes(userId), signal),
    }),
  getPendingRsvps: (userId: string = "me") =>
    queryOptions<RsvpEvent[]>({
      queryKey: userKeys.pendingRsvps(userId),
      queryFn: ({ signal }) =>
        cancelableQuery(api.user.getUserPendingRsvPs(userId), signal),
    }),
  getUsers: queryOptions({
    queryKey: userKeys.users,
    queryFn: ({ signal }) => cancelableQuery(api.user.getUsers(), signal),
  }),

  editUser: mutationOptions({
    mutationFn: ({ userId = "me", ...data }: UserEditData) =>
      api.user.editUser(userId, data),
  }),
  deleteUser: mutationOptions({
    mutationFn: (userId: string = "me") => api.user.deleteUser(userId),
  }),
  createUserScancode: mutationOptions({
    mutationFn: ({ userId = "me", ...data }: CreateScancodeData) =>
      api.user.createUserScancode(userId, data),
  }),
  deleteUserScancode: mutationOptions({
    mutationFn: ({ userId = "me", scancodeId }: DeleteScancodeData) =>
      api.user.deleteUserScancode(userId, scancodeId),
  }),
};

export default userApi;
