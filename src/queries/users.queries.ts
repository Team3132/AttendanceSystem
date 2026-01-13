import {
  adminMiddleware,
  sessionMiddleware,
} from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import type { UserListParamsSchema } from "@/server/schema";
import {
  getPendingUserRsvps,
  getUser,
  getUserList,
  getUserScancodes,
  getUserSessions,
} from "@/server/services/user.service";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type UserListParams = Omit<z.infer<typeof UserListParamsSchema>, "cursor">;

const getUserScancodesFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .inputValidator(z.string().describe("The user ID"))
  .handler(async ({ data }) => getUserScancodes(data));

const getSelfFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => context.user);

const getSelfScancodesFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => getUserScancodes(context.user.id));

const getSelfPendingRsvpsFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => getPendingUserRsvps(context.user.id));

const getUserPendingRsvpsFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .inputValidator(z.string().describe("The user ID"))
  .handler(async ({ data }) => getPendingUserRsvps(data));

const getUserSessionsFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .inputValidator(z.string())
  .handler(async ({ data }) => getUserSessions(data));

const getSelfSessionsFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => getUserSessions(context.user.id));

export const usersQueryOptions = {
  userList: (params: UserListParams) =>
    infiniteQueryOptions({
      queryFn: ({ pageParam, signal }) =>
        getUserList({
          data: {
            ...params,
            cursor: pageParam ?? undefined,
          },
          signal,
        }),
      queryKey: usersQueryKeys.usersListParams(params),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: undefined as number | null | undefined,
    }),

  userDetails: (id: string) =>
    queryOptions({
      queryFn: ({ signal }) => getUser({ data: id, signal }),
      queryKey: usersQueryKeys.userDetails(id),
    }),

  userScancodes: (id: string) =>
    queryOptions({
      queryFn: ({ signal }) => getUserScancodesFn({ data: id, signal }),
      queryKey: usersQueryKeys.userScancodes(id),
    }),

  userSelfDetails: () =>
    queryOptions({
      queryFn: ({ signal }) => getSelfFn({ signal }),
      queryKey: usersQueryKeys.userSelfDetails(),
    }),

  userSelfScancodes: () =>
    queryOptions({
      queryFn: ({ signal }) => getSelfScancodesFn({ signal }),
      queryKey: usersQueryKeys.userSelfScancodes(),
    }),

  userPendingRsvps: (id: string) =>
    queryOptions({
      queryFn: ({ signal }) => getUserPendingRsvpsFn({ data: id, signal }),
      queryKey: usersQueryKeys.userPendingRsvps(id),
    }),

  userSelfPendingRsvps: () =>
    queryOptions({
      queryFn: ({ signal }) => getSelfPendingRsvpsFn({ signal }),
      queryKey: usersQueryKeys.userSelfPendingRsvps(),
    }),

  userSelfSessions: () =>
    queryOptions({
      queryFn: ({ signal }) => getSelfSessionsFn({ signal }),
      queryKey: usersQueryKeys.userSelfSessions(),
    }),

  userSessions: (id: string) =>
    queryOptions({
      queryFn: ({ signal }) => getUserSessionsFn({ data: id, signal }),
      queryKey: usersQueryKeys.userSessions(id),
    }),
};
