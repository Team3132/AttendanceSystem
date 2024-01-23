import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import useRouteMatch from "../utils/useRouteMatch";
import {
  FaHouse,
  FaHouseLock,
  FaPeopleGroup,
  FaRegCalendar,
} from "react-icons/fa6";
import { useMemo } from "react";
import { trpc } from "@/trpcClient";
import AsChildLink from "@/components/AsChildLink";
import { Outlet, RouteApi } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { TabItem } from "@/types/TabItem";

const routeApi = new RouteApi({
  id: "/authedOnly",
});

export function Component() {
  const initialAuthStatus = routeApi.useLoaderData();

  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
    initialData: initialAuthStatus,
  });

  const routes = useMemo<TabItem[]>(
    () =>
      authStatusQuery.data.isAdmin
        ? ([
            {
              to: "/",
              label: "Home",
              icon: <FaHouse />,
            },
            {
              to: "/leaderboard/outreach",
              label: "Leaderboard",
              icon: <FaPeopleGroup />,
            },
            {
              to: "/events",
              label: "Events",
              fuzzy: true,
              icon: <FaRegCalendar />,
            },
            { to: "/admin", label: "Admin", icon: <FaHouseLock /> },
          ] satisfies TabItem[])
        : ([
            {
              to: "/",
              label: "Home",
              icon: <FaHouse />,
            },
            {
              to: "/leaderboard/outreach",
              label: "Leaderboard",
              icon: <FaPeopleGroup />,
            },
            {
              to: "/events",
              fuzzy: true,
              label: "Events",
              icon: <FaRegCalendar />,
            },
          ] satisfies TabItem[]),
    [authStatusQuery.data.isAdmin]
  );

  const currentTab = useRouteMatch(routes);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Outlet />

      <BottomNavigation showLabels>
        <BottomNavigationAction />
      </BottomNavigation>
      <BottomNavigation
        showLabels
        value={currentTab}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {routes.map((route, index) => (
          <AsChildLink to={route.to} params={route.params} key={route.to}>
            <BottomNavigationAction
              label={route.label}
              icon={route.icon}
              value={index}
            />
          </AsChildLink>
        ))}
      </BottomNavigation>
      <TanStackRouterDevtools />
    </Box>
  );
}
