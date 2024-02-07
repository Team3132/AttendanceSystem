import { adminOnlyRoute } from "@/features/auth/routes";
import { Route, lazyRouteComponent } from "@tanstack/react-router";

export const adminIndexRoute = new Route({
  getParentRoute: () => adminOnlyRoute,
  path: "/admin",
  component: lazyRouteComponent(
    () => import("../pages/AdminHome"),
    "Component",
  ),
});
