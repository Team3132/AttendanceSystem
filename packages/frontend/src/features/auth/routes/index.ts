import { rootRoute } from "@/router";
import { Route, redirect } from "@tanstack/react-router";

export const authedOnlyRoute = new Route({
  getParentRoute: () => rootRoute,
  beforeLoad: async ({ context: { queryUtils } }) => {
    const authStatus = await queryUtils.auth.status.ensureData();
    if (!authStatus.isAuthenticated) throw redirect({ to: "/login" });
  },
  id: "authedOnly",
});

/**
 * This route protects the admin routes from being accessed by non-admins. Doesn't include a path
 */
export const adminOnlyRoute = new Route({
  getParentRoute: () => rootRoute,
  beforeLoad: async ({ context: { queryUtils } }) => {
    const authData = await queryUtils.auth.status.ensureData();
    if (!authData.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
    if (!authData.isAdmin) {
      throw redirect({ to: "/" });
    }
  },
  id: "adminOnly",
});

export const unauthedOnlyRoute = new Route({
  getParentRoute: () => rootRoute,
  beforeLoad: async ({ context: { queryUtils } }) => {
    const authStatus = await queryUtils.auth.status.ensureData();
    if (authStatus.isAuthenticated) throw redirect({ to: "/" });
  },
  id: "unauthedOnly",
});
