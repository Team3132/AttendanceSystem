import { queryOptions } from "@tanstack/react-query";
import { authQueryKeys } from "@/api/queryKeys";
import { createMiddleware, createServerFn } from "@tanstack/start";
import { getCookie, getHeader, setCookie } from "vinxi/http";
import { lucia } from "@/api/auth/lucia";
import env from "@/api/env";
import { authBaseMiddleware } from "@/middleware/authMiddleware";

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