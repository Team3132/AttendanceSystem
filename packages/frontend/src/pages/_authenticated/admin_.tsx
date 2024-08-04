import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context: { queryUtils } }) => {
    const { isAuthenticated, isAdmin } =
      await queryUtils.auth.status.ensureData();

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
