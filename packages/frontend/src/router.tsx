import { createBrowserRouter } from "react-router-dom";
import {
  Route,
  RoutePaths,
  Router,
  lazyRouteComponent,
} from "@tanstack/react-router";
import RouterErrorPage from "./pages/RouterErrorPage";
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

const router = createBrowserRouter([
  {
    errorElement: <RouterErrorPage />,
    children: [
      {
        path: "/error",
        lazy: () => import("./pages/QueryErrorPage"),
      },
      {
        path: "/login",
        lazy: () => import("./features/auth/pages/LoginPage"),
      },
      {
        lazy: () => import("./templates/NavigationWrapper"),
        children: [
          {
            index: true,
            lazy: () => import("./pages/HomePage"),
          },
          {
            path: "/leaderboard",
            lazy: () => import("./features/outreach/pages/OutreachHome"),
            children: [
              {
                path: "outreach",
                lazy: () => import("./features/outreach/pages/LeaderBoardCard"),
              },
              {
                path: "build-points",
                lazy: () =>
                  import(
                    "./features/outreach/pages/BuildPointsLeaderboardCard"
                  ),
              },
            ],
          },
          {
            path: "/events",
            children: [
              {
                index: true,
                lazy: () => import("./features/events/pages/EventsHome"),
              },
              {
                path: "create",
                lazy: () => import("./features/events/pages/EventCreate"),
              },
              {
                path: ":eventId",
                lazy: () => import("./features/events/pages/EventPage"),
                children: [
                  {
                    index: true,
                    lazy: () => import("./features/events/pages/EventDetails"),
                  },
                  {
                    path: "check-in",
                    lazy: () => import("./features/events/pages/EventCheckin"),
                  },
                  {
                    path: "qr-code",
                    lazy: () => import("./features/events/pages/EventQRCode"),
                  },
                ],
              },
            ],
          },
          {
            path: "/profile",
            lazy: () => import("./features/user/pages/ProfilePage"),
            children: [
              {
                index: true,
                lazy: () => import("./features/user/pages/ScancodePage"),
              },
              {
                path: "pending",
                lazy: () => import("./features/user/pages/PendingEventsPage"),
              },
              {
                path: "build-points",
                lazy: () => import("./features/user/pages/BuildPointsPage"),
              },
            ],
          },
          {
            path: "/user/:userId",
            lazy: () => import("./features/user/pages/AdminProfilePage"),
            children: [
              {
                index: true,
                lazy: () => import("./features/user/pages/AdminScancodePage"),
              },
              {
                path: "pending",
                lazy: () =>
                  import("./features/user/pages/AdminPendingEventsPage"),
              },
              {
                path: "build-points",
                lazy: () =>
                  import("./features/user/pages/AdminBuildPointsPage"),
              },
            ],
          },
          {
            path: "/admin",
            lazy: () => import("./features/admin/pages/AdminHome"),
          },
        ],
      },
    ],
  },
]);

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

export const newRouter = new Router({
  routeTree,
  context: {
    queryClient,
    queryUtils,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof newRouter;
  }
}

export type RouterPaths = RoutePaths<typeof routeTree>;

export default router;
