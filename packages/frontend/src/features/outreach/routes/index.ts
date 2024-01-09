import { authedOnlyRoute } from "@/features/auth/routes";
import { Route, lazyRouteComponent } from "@tanstack/react-router";

const leaderboardRoute = new Route({
  getParentRoute: () => authedOnlyRoute,
  path: "/leaderboard",
  component: lazyRouteComponent(
    () => import("../pages/OutreachHome"),
    "Component"
  ),
});

const outreachLeaderboardRoute = new Route({
  getParentRoute: () => leaderboardRoute,
  path: "/outreach",
  loader: ({ context: { queryUtils } }) =>
    queryUtils.outreach.outreachLeaderboard.prefetchInfinite({
      limit: 10,
    }),
  component: lazyRouteComponent(
    () => import("../pages/LeaderBoardCard"),
    "Component"
  ),
});

const buildPointsLeaderboardRoute = new Route({
  getParentRoute: () => leaderboardRoute,
  path: "/build-points",
  loader: ({ context: { queryUtils } }) =>
    queryUtils.outreach.buildPointsLeaderboard.prefetchInfinite({
      limit: 10,
    }),
  component: lazyRouteComponent(
    () => import("../pages/LeaderBoardCard"),
    "Component"
  ),
});

export const outreachRoutes = leaderboardRoute.addChildren([
  outreachLeaderboardRoute,
  buildPointsLeaderboardRoute,
]);
