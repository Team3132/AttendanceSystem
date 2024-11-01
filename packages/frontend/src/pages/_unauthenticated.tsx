import { authQueryOptions } from "@/queries/auth.queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const { isAuthenticated } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );
    if (isAuthenticated) {
      throw redirect({
        to: "/", // Redirect to the home page
      });
    }
  },
});
