import { lucia } from "@/server/auth/lucia";
import { authBaseMiddleware } from "@/middleware/authMiddleware";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { setCookie } from "vinxi/http";

const logoutFn = createServerFn({
  method: "POST",
})
  .middleware([authBaseMiddleware])
  .handler(async ({ context: { session } }) => {
    if (session) {
      await lucia.invalidateSession(session.id);
      // Clear the session cookie
      const blankCookie = lucia.createBlankSessionCookie();
      setCookie(blankCookie.name, blankCookie.value, blankCookie.attributes);

      // throw redirect({
      //   to: "/login",
      // });
      return { success: true };
    }

    return { success: false };
  });

export default function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutFn(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
