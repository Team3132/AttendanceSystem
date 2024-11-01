import { authQueryOptions } from "@/queries/auth.queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin_")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const { isAuthenticated, isAdmin } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    if (!isAdmin) {
      throw redirect({
        to: "/",
        search: {
          error: "You are not an admin",
        },
      });
    }
  },
});
