import {
  mentorMiddleware,
  sessionMiddleware,
} from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import { UserListParamsSchema } from "@/server/schema";
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

const getUserListFn = createServerFn({ method: "GET" })
  .middleware([mentorMiddleware])
  .validator(UserListParamsSchema)
  .handler(async ({ data }) => getUserList(data));

const getUserFn = createServerFn({ method: "GET" })
  .middleware([mentorMiddleware])
  .validator(z.string().describe("The user ID"))
  .handler(async ({ data }) => getUser(data));

const getUserScancodesFn = createServerFn({ method: "GET" })
  .middleware([mentorMiddleware])
  .validator(z.string().describe("The user ID"))
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
  .middleware([mentorMiddleware])
  .validator(z.string().describe("The user ID"))
  .handler(async ({ data }) => getPendingUserRsvps(data));

const getUserSessionsFn = createServerFn({ method: "GET" })
  .middleware([mentorMiddleware])
  .validator(z.string())
  .handler(async ({ data }) => getUserSessions(data));

const getSelfSessionsFn = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(async ({ context }) => getUserSessions(context.user.id));

export const usersQueryOptions = {
  userList: (params: UserListParams) =>
    infiniteQueryOptions({
      queryFn: ({ pageParam }) =>
        getUserListFn({
          data: {
            ...params,
            cursor: pageParam ?? undefined,
          },
        }),
      queryKey: usersQueryKeys.usersListParams(params),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: undefined as number | null | undefined,
    }),

  userDetails: (id: string) =>
    queryOptions({
      queryFn: () => getUserFn({ data: id }),
      queryKey: usersQueryKeys.userDetails(id),
    }),

  userScancodes: (id: string) =>
    queryOptions({
      queryFn: () => getUserScancodesFn({ data: id }),
      queryKey: usersQueryKeys.userScancodes(id),
    }),

  userSelfDetails: () =>
    queryOptions({
      queryFn: () => getSelfFn(),
      queryKey: usersQueryKeys.userSelfDetails(),
    }),

  userSelfScancodes: () =>
    queryOptions({
      queryFn: () => getSelfScancodesFn(),
      queryKey: usersQueryKeys.userSelfScancodes(),
    }),

  userPendingRsvps: (id: string) =>
    queryOptions({
      queryFn: () => getUserPendingRsvpsFn({ data: id }),
      queryKey: usersQueryKeys.userPendingRsvps(id),
    }),

  userSelfPendingRsvps: () =>
    queryOptions({
      queryFn: () => getSelfPendingRsvpsFn(),
      queryKey: usersQueryKeys.userSelfPendingRsvps(),
    }),

  userSelfSessions: () =>
    queryOptions({
      queryFn: getSelfSessionsFn,
      queryKey: usersQueryKeys.userSelfSessions(),
    }),

  userSessions: (id: string) =>
    queryOptions({
      queryFn: () => getUserSessionsFn({ data: id }),
      queryKey: usersQueryKeys.userSessions(id),
    }),
};
