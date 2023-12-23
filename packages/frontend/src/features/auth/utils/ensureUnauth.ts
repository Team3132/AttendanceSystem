import { redirect } from "react-router-dom";
import queryUtils from "@/utils/queryUtils";

/**
 * Ensures that the user is authenticated. If not, it will redirect to the login page.
 * This should only be used in loaders.
 */
export default async function ensureUnAuth() {
  const result = await queryUtils.auth.status.ensureData();

  if (result.isAuthenticated) {
    throw redirect("/");
  }

  return result;
}
