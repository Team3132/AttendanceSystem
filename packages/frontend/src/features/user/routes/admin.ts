import { adminOnlyRoute } from "@/features/auth/routes";
import { Route, lazyRouteComponent } from "@tanstack/react-router";

const adminUserRoute = new Route({
  getParentRoute: () => adminOnlyRoute,
  path: "/user/$userId",
  component: lazyRouteComponent(
    () => import("../pages/AdminProfilePage"),
    "Component"
  ),
  loader: async ({ context: { queryUtils }, params }) => {
    const [initialUser] = await Promise.all([
      await queryUtils.users.getUser.ensureData(params.userId),
    ]);

    return {
      userId: params.userId,
      initialUser,
    };
  },
});

const adminUserIndexRoute = new Route({
  getParentRoute: () => adminUserRoute,
  path: "/",
  loader: async ({ context: { queryUtils }, params }) => {
    const [initialUser, initialScancodes] = await Promise.all([
      await queryUtils.users.getUser.ensureData(params.userId),
      await queryUtils.users.getUserScancodes.ensureData(params.userId),
    ]);

    return {
      userId: params.userId,
      initialUser,
      initialScancodes,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/AdminScancodePage"),
    "Component"
  ),
});

const adminUserPendingEventsRoute = new Route({
  getParentRoute: () => adminUserRoute,
  path: "/pending",
  loader: async ({ context: { queryUtils }, params }) => {
    const [initialUser, initialPendingEvents] = await Promise.all([
      await queryUtils.users.getUser.ensureData(params.userId),
      await queryUtils.users.getUserPendingRsvps.ensureData(params.userId),
    ]);

    return {
      userId: params.userId,
      initialUser,
      initialPendingEvents,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/AdminPendingEventsPage"),
    "Component"
  ),
});

const adminUserBuildPointsRoute = new Route({
  path: "/build-points",
  getParentRoute: () => adminUserRoute,
  loader: async ({ context: { queryUtils }, params }) => {
    const [initialUser] = await Promise.all([
      await queryUtils.users.getUser.ensureData(params.userId),
    ]);

    return {
      userId: params.userId,
      initialUser,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/AdminBuildPointsPage"),
    "Component"
  ),
});

export const adminUserRoutes = adminUserRoute.addChildren([
  adminUserIndexRoute,
  adminUserPendingEventsRoute,
  adminUserBuildPointsRoute,
]);
