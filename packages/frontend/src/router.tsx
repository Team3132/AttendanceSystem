import type { QueryClient } from "@tanstack/react-query";
import {
  Route,
  type RoutePaths,
  Router,
  lazyRouteComponent,
  createRouter,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { rootRouteWithContext } from "@tanstack/react-router";
import type { CreateQueryUtils } from "@trpc/react-query/shared";
import type { AppRouter } from "backend";
import { adminIndexRoute } from "./features/admin/routes";
import {
  adminOnlyRoute,
  authedOnlyRoute,
  unauthedOnlyRoute,
} from "./features/auth/routes";
import { eventQrCodeRoute, eventsRoutes } from "./features/events/routes";
import { outreachRoutes } from "./features/outreach/routes";
import { adminUserRoutes, profileRoutes } from "./features/user/routes";
import { queryClient, queryUtils } from "./trpcClient";
import { routeTree } from "./routeTree.gen";

/**
 * Home Page
 */
// const indexRoute = new Route({
//   getParentRoute: () => authedOnlyRoute,
//   component: lazyRouteComponent(
//     () => import("./pages/_authenticated"),
//     "Component",
//   ),
//   loader: ({ context: { queryUtils } }) =>
//     queryUtils.users.getSelfPendingRsvps.ensureData(),
//   path: "/",
// });

// const loginRoute = new Route({
//   getParentRoute: () => unauthedOnlyRoute,
//   path: "/login",
//   loader: ({ context: { queryUtils } }) => queryUtils.auth.status.ensureData(),
//   component: lazyRouteComponent(
//     () => import("./features/auth/pages/LoginPage"),
//     "Component",
//   ),
// });

// const routeTree = rootRoute.addChildren([
//   unauthedOnlyRoute.addChildren([loginRoute]),
//   authedOnlyRoute.addChildren([
//     indexRoute,
//     outreachRoutes,
//     profileRoutes,
//     eventsRoutes,
//     adminOnlyRoute.addChildren([
//       adminIndexRoute,
//       adminUserRoutes,
//       eventQrCodeRoute,
//     ]),
//   ]),
// ]);

// export type RouterPaths = RoutePaths<typeof routeTree>;

// export default router;
