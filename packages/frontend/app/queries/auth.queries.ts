import { authBaseMiddleware } from "@/middleware/authMiddleware";
import env from "@/server/env";
import { authQueryKeys } from "@/server/queryKeys";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

const authStatusFn = createServerFn({ method: "GET" })
  .middleware([authBaseMiddleware])
  .handler(async ({ context }) => {
    return {
      isAuthenticated: !!context.user,
      isAdmin: context.user?.roles?.includes(env.VITE_MENTOR_ROLE_ID) ?? false,
    };
  });

export const authQueryOptions = {
  status: () =>
    queryOptions({
      queryKey: authQueryKeys.status(),
      queryFn: () => authStatusFn(),
    }),
};
