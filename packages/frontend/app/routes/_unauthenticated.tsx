import { authGuard } from "@/server/auth/authGuard";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  beforeLoad: async () => {
    "use server";
    const { session, user } = await authGuard({ successRedirect: "/" })
    console.log({ session, user });
  },
});
