import {
  Route,
  RoutePaths,
  Router,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { rootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { CreateQueryUtils } from "@trpc/react-query/shared";
import type { AppRouter } from "backend";
import { queryClient, queryUtils } from "./trpcClient";
import { outreachRoutes } from "./features/outreach/routes";
import { adminIndexRoute } from "./features/admin/routes";
import {
  adminOnlyRoute,
  authedOnlyRoute,
  unauthedOnlyRoute,
} from "./features/auth/routes";
import { adminUserRoutes, profileRoutes } from "./features/user/routes";
import { eventQrCodeRoute, eventsRoutes } from "./features/events/routes";

export const rootRoute = rootRouteWithContext<{
  queryClient: QueryClient;
  queryUtils: CreateQueryUtils<AppRouter>;
}>()();

/**
 * Home Page
 */
const indexRoute = new Route({
  getParentRoute: () => authedOnlyRoute,
  component: lazyRouteComponent(() => import("./pages/HomePage"), "Component"),
  loader: ({ context: { queryUtils } }) =>
    queryUtils.users.getSelfPendingRsvps.ensureData(),
  path: "/",
});

const loginRoute = new Route({
  getParentRoute: () => unauthedOnlyRoute,
  path: "/login",
  loader: ({ context: { queryUtils } }) => queryUtils.auth.status.ensureData(),
  component: lazyRouteComponent(
    () => import("./features/auth/pages/LoginPage"),
    "Component"
  ),
});

const routeTree = rootRoute.addChildren([
  unauthedOnlyRoute.addChildren([loginRoute]),
  authedOnlyRoute.addChildren([
    indexRoute,
    outreachRoutes,
    profileRoutes,
    eventsRoutes,
  ]),
  adminOnlyRoute.addChildren([
    adminIndexRoute,
    adminUserRoutes,
    eventQrCodeRoute,
  ]),
]);

export const router = new Router({
  routeTree,
  context: {
    queryClient,
    queryUtils,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export type RouterPaths = RoutePaths<typeof routeTree>;

export default router;
