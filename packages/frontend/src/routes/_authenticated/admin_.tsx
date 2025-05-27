import { authQueryOptions } from "@/queries/auth.queries";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute({
  beforeLoad: async ({ context: { queryClient } }) => {
    const { isAdmin } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );

    if (!isAdmin) {
      throw redirect({
        to: "/error",
        search: {
          message: "You are not an admin",
        },
      });
    }
  },
});
