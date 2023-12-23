import { queryUtils } from "@/trpcClient";
import { redirect } from "react-router-dom";

/**
 * Ensures that the user is authenticated. If not, it will redirect to the login page.
 * This should only be used in loaders.
 */
export default async function ensureAuth(admin = false) {
  const result = await queryUtils.auth.status.ensureData();

  if (!result.isAuthenticated) {
    throw redirect("/login");
  }

  if (admin && !result.isAdmin) {
    throw redirect("/login");
  }

  return result;
}
