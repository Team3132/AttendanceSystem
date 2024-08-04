import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  beforeLoad: async ({ context: { queryUtils }, location }) => {
    const { isAuthenticated } = await queryUtils.auth.status.ensureData();
    if (isAuthenticated) {
      throw redirect({
        to: "/", // Redirect to the home page
      });
    }
  },
});
