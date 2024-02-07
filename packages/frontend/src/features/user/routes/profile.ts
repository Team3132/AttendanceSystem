import { authedOnlyRoute } from "@/features/auth/routes";
import { Route, lazyRouteComponent } from "@tanstack/react-router";

const profileRoute = new Route({
  getParentRoute: () => authedOnlyRoute,
  component: lazyRouteComponent(
    () => import("../pages/ProfilePage"),
    "Component",
  ),
  path: "/profile",
  loader: async ({ context: { queryUtils } }) => {
    const [initialUser] = await Promise.all([
      await queryUtils.users.getSelf.ensureData(),
      await queryUtils.users.getSelfScancodes.ensureData(),
    ]);

    return {
      initialUser,
    };
  },
});

const profileIndexRoute = new Route({
  getParentRoute: () => profileRoute,
  path: "/",
  loader: async ({ context: { queryUtils } }) => {
    const [initialUser, initialScancodes] = await Promise.all([
      await queryUtils.users.getSelf.ensureData(),
      await queryUtils.users.getSelfScancodes.ensureData(),
    ]);

    return {
      initialUser,
      initialScancodes,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/ScancodePage"),
    "Component",
  ),
});

const profilePendingEventsRoute = new Route({
  getParentRoute: () => profileRoute,
  path: "/pending",
  loader: async ({ context: { queryUtils } }) => {
    const [initialUser, initialPendingEvents] = await Promise.all([
      await queryUtils.users.getSelf.ensureData(),
      await queryUtils.users.getSelfPendingRsvps.ensureData(),
    ]);

    return {
      initialUser,
      initialPendingEvents,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/PendingEventsPage"),
    "Component",
  ),
});

const profileBuildPointsRoute = new Route({
  path: "/build-points",
  getParentRoute: () => profileRoute,
  loader: async ({ context: { queryUtils } }) => {
    const [initialUser] = await Promise.all([
      await queryUtils.users.getSelf.ensureData(),
    ]);

    return {
      initialUser,
    };
  },
  component: lazyRouteComponent(
    () => import("../pages/BuildPointsPage"),
    "Component",
  ),
});

export const profileRoutes = profileRoute.addChildren([
  profileIndexRoute,
  profilePendingEventsRoute,
  profileBuildPointsRoute,
]);
