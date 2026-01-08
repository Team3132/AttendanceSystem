import { authBaseMiddleware } from "@/middleware/authMiddleware";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

const logoutFn = createServerFn({
  method: "POST",
})
  .middleware([authBaseMiddleware])
  .handler(async ({ context: { session, lucia } }) => {
    if (session) {
      await lucia.invalidateSession(session.id);
      // Clear the session cookie
      const blankCookie = lucia.createBlankSessionCookie();
      setResponseHeader("Set-Cookie", blankCookie.serialize());

      // throw redirect({
      //   to: "/login",
      // });
      return { success: true };
    }

    return { success: false };
  });

export default function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await logoutFn();
    },
    onSuccess: () => {
      queryClient.clear();
      navigate({
        to: "/login",
      });
    },
  });
}
