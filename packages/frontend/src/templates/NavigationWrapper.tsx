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
import { RouterPaths } from "@/router";
import AsChildLink from "@/components/AsChildLink";
import { Outlet, RouteApi } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const routeApi = new RouteApi({
  id: "/authedOnly",
});

export function Component() {
  const initialAuthStatus = routeApi.useLoaderData();

  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
    initialData: initialAuthStatus,
  });

  const routes = useMemo(
    () =>
      authStatusQuery.data.isAdmin
        ? ([
            "/",
            "/leaderboard/outreach",
            "/events",
            "/admin",
          ] satisfies RouterPaths[])
        : (["/", "/leaderboard/outreach", "/events"] satisfies RouterPaths[]),
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
        <AsChildLink to="/">
          <BottomNavigationAction label="Home" value="/" icon={<FaHouse />} />
        </AsChildLink>
        <AsChildLink to="/leaderboard/outreach">
          <BottomNavigationAction
            label="Leaderboard"
            value="/leaderboard/outreach"
            icon={<FaPeopleGroup />}
          />
        </AsChildLink>
        <AsChildLink to="/events">
          <BottomNavigationAction
            label="Events"
            value="/events"
            icon={<FaRegCalendar />}
          />
        </AsChildLink>
        {authStatusQuery.data.isAdmin ? (
          <AsChildLink to="/admin">
            <BottomNavigationAction
              label="Admin"
              value="/admin"
              icon={<FaHouseLock />}
            />
          </AsChildLink>
        ) : null}
      </BottomNavigation>
      <TanStackRouterDevtools />
    </Box>
  );
}
