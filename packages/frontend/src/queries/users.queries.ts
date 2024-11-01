import { proxyClient } from "@/trpcClient";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { UserListParamsSchema } from "backend/schema/UserListParamsSchema";
import { z } from "zod";

type UserListParams = Omit<z.infer<typeof UserListParamsSchema>, "cursor">;

export const usersQueryKeys = {
  users: ["users"] as const, // Root key for all user-related queries
  usersList: ["users", "list"] as const, // Key for the list of users
  usersListParams: (params: UserListParams) =>
    [...usersQueryKeys.usersList, params] as const, // Key for the list of users with specific parameters
  /** The details of the user */
  user: (id: string) => [...usersQueryKeys.users, "user", id] as const, // Root key for a specific user
  userDetails: (id: string) => [...usersQueryKeys.user(id), "details"] as const, // Key for the details of a specific user
  userScancodes: (id: string) =>
    [...usersQueryKeys.user(id), "scancodes"] as const, // Key for the scancodes of a specific user
  userPendingRsvps: (id: string) =>
    [...usersQueryKeys.user(id), "pendingRsvps"] as const, // Key for the pending rsvps of a specific user
  userSelf: () => [...usersQueryKeys.users, "self"] as const, // Root key for the current user
  userSelfDetails: () => [...usersQueryKeys.userSelf(), "details"] as const, // Key for the details of the current user
  userSelfScancodes: () => [...usersQueryKeys.userSelf(), "scancodes"] as const, // Key for the scancodes of the current user
  userSelfPendingRsvps: () =>
    [...usersQueryKeys.userSelf(), "pendingRsvps"] as const, // Key for the pending rsvps of the current user
};

export const usersQueryOptions = {
  userList: (params: UserListParams) =>
    infiniteQueryOptions({
      queryFn: ({ pageParam }) =>
        proxyClient.users.getUserList.query({
          ...params,
          cursor: pageParam ?? undefined,
        }),
      queryKey: usersQueryKeys.usersListParams(params),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: undefined as number | null | undefined,
    }),

  userDetails: (id: string) =>
    queryOptions({
      queryFn: () => proxyClient.users.getUser.query(id),
      queryKey: usersQueryKeys.userDetails(id),
    }),

  userScancodes: (id: string) =>
    queryOptions({
      queryFn: () => proxyClient.users.getUserScancodes.query(id),
      queryKey: usersQueryKeys.userScancodes(id),
    }),

  userSelfDetails: () =>
    queryOptions({
      queryFn: () => proxyClient.users.getSelf.query(),
      queryKey: usersQueryKeys.userSelfDetails(),
    }),

  userSelfScancodes: () =>
    queryOptions({
      queryFn: () => proxyClient.users.getSelfScancodes.query(),
      queryKey: usersQueryKeys.userSelfScancodes(),
    }),

  userPendingRsvps: (id: string) =>
    queryOptions({
      queryFn: () => proxyClient.users.getUserPendingRsvps.query(id),
      queryKey: usersQueryKeys.userPendingRsvps(id),
    }),

  userSelfPendingRsvps: () =>
    queryOptions({
      queryFn: () => proxyClient.users.getSelfPendingRsvps.query(),
      queryKey: usersQueryKeys.userSelfPendingRsvps(),
    }),
};
