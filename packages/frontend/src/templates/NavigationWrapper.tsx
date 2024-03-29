import AsChildLink from "@/components/AsChildLink";
import { trpc } from "@/trpcClient";
import type { TabItem } from "@/types/TabItem";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Outlet, RouteApi } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useMemo } from "react";
import {
  FaHouse,
  FaHouseLock,
  FaPeopleGroup,
  FaRegCalendar,
} from "react-icons/fa6";
import useRouteMatch from "../utils/useRouteMatch";

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
          ] as TabItem[])
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
          ] as TabItem[]),
    [authStatusQuery.data.isAdmin],
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
