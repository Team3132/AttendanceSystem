import { trpcClient } from "@/trpcClient";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { UserListParamsSchema } from "@/api/schema";
import { z } from "zod";
import { usersQueryKeys } from "@/api/queryKeys";

type UserListParams = Omit<z.infer<typeof UserListParamsSchema>, "cursor">;

export const usersQueryOptions = {
  userList: (params: UserListParams) =>
    infiniteQueryOptions({
      queryFn: ({ pageParam }) =>
        trpcClient.users.getUserList.query({
          ...params,
          cursor: pageParam ?? undefined,
        }),
      queryKey: usersQueryKeys.usersListParams(params),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: undefined as number | null | undefined,
    }),

  userDetails: (id: string) =>
    queryOptions({
      queryFn: () => trpcClient.users.getUser.query(id),
      queryKey: usersQueryKeys.userDetails(id),
    }),

  userScancodes: (id: string) =>
    queryOptions({
      queryFn: () => trpcClient.users.getUserScancodes.query(id),
      queryKey: usersQueryKeys.userScancodes(id),
    }),

  userSelfDetails: () =>
    queryOptions({
      queryFn: () => trpcClient.users.getSelf.query(),
      queryKey: usersQueryKeys.userSelfDetails(),
    }),

  userSelfScancodes: () =>
    queryOptions({
      queryFn: () => trpcClient.users.getSelfScancodes.query(),
      queryKey: usersQueryKeys.userSelfScancodes(),
    }),

  userPendingRsvps: (id: string) =>
    queryOptions({
      queryFn: () => trpcClient.users.getUserPendingRsvps.query(id),
      queryKey: usersQueryKeys.userPendingRsvps(id),
    }),

  userSelfPendingRsvps: () =>
    queryOptions({
      queryFn: () => trpcClient.users.getSelfPendingRsvps.query(),
      queryKey: usersQueryKeys.userSelfPendingRsvps(),
    }),
};
