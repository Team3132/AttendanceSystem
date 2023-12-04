import { redirect } from "react-router-dom";
import queryClient from "../../../queryClient";
import { trpc } from "../../../utils/trpc";
import { getQueryKey } from "@trpc/react-query";
import { trpcProxyClient } from "../../../trpcClient";

/**
 * Ensures that the user is authenticated. If not, it will redirect to the login page.
 * This should only be used in loaders.
 */
export default async function ensureAuth(admin = false) {
  const result = await queryClient.ensureQueryData({
    queryKey: getQueryKey(trpc.auth.status),
    queryFn: () => trpcProxyClient.auth.status.query(),
  });

  if (!result.isAuthenticated) {
    throw redirect("/login");
  }

  if (admin && !result.isAdmin) {
    throw redirect("/login");
  }

  return result;
}
