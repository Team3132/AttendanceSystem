import { rootRoute } from "@/router";
import { Route, lazyRouteComponent, redirect } from "@tanstack/react-router";

export const authedOnlyRoute = new Route({
  getParentRoute: () => rootRoute,
  beforeLoad: async ({ context: { queryUtils } }) => {
    const authStatus = await queryUtils.auth.status.ensureData();
    if (!authStatus.isAuthenticated) throw redirect({ to: "/login" });
  },
  loader: ({ context: { queryUtils } }) => queryUtils.auth.status.ensureData(),
  component: lazyRouteComponent(
    () => import("../../../templates/NavigationWrapper"),
    "Component"
  ),
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
  loader: ({ context: { queryUtils } }) => queryUtils.auth.status.ensureData(),
  component: lazyRouteComponent(
    () => import("../../../templates/AdminNavigationWrapper"),
    "Component"
  ),
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
