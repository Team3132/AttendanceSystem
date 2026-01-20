import { authBaseMiddleware } from "@/middleware/authMiddleware";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/server/auth/session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redirect, useNavigate } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";

const logoutFn = createServerFn({
  method: "POST",
})
  .middleware([authBaseMiddleware])
  .handler(async ({ context }) => {
    const { session } = await getCurrentSession(context);

    if (session === null) {
      throw new Error("Not authenticated");
    }

    await invalidateSession(context, session.id);

    deleteSessionTokenCookie();

    throw redirect({
      to: "/login",
    });
  });

export default function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useServerFn(logoutFn);

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.clear();
      navigate({
        to: "/login",
      });
    },
  });
}
