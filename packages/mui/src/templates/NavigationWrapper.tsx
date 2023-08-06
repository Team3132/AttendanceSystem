import { useQuery } from "@tanstack/react-query";
import ensureAuth from "../features/auth/utils/ensureAuth";
import authApi from "../api/query/auth.api";
import { Outlet, useLoaderData } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import useRouteMatch from "../utils/useRouteMatch";
import LinkBehavior from "../utils/LinkBehavior";
import {
  FaCircleUser,
  FaHouse,
  FaHouseLock,
  FaPeopleGroup,
  FaRegCalendar,
} from "react-icons/fa6";
import { useMemo } from "react";

export async function loader() {
  const initialAuthStatus = await ensureAuth();

  return {
    initialAuthStatus,
  };
}

export function Component() {
  const { initialAuthStatus } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  const authStatusQuery = useQuery({
    ...authApi.getAuthStatus,
    initialData: initialAuthStatus,
  });

  const routes = useMemo(
    () =>
      !authStatusQuery.data.isAdmin
        ? ["/", "/outreach", "/events"]
        : ["/", "/outreach", "/events", "/admin"],
    [authStatusQuery.data.isAdmin],
  );

  const routeMatch = useRouteMatch(routes);

  const currentTab = routeMatch?.pattern.path;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      <Outlet />
      <BottomNavigation />
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
        <BottomNavigationAction
          label="Home"
          value="/"
          LinkComponent={LinkBehavior}
          href="/"
          icon={<FaHouse />}
        />
        <BottomNavigationAction
          label="Outreach"
          value="/outreach"
          LinkComponent={LinkBehavior}
          href="/outreach"
          icon={<FaPeopleGroup />}
        />
        <BottomNavigationAction
          label="Events"
          value="/events"
          LinkComponent={LinkBehavior}
          href="/events"
          icon={<FaRegCalendar />}
        />
        {authStatusQuery.data.isAdmin ? (
          <BottomNavigationAction
            label="Admin"
            value="/admin"
            LinkComponent={LinkBehavior}
            href="/admin"
            icon={<FaHouseLock />}
          />
        ) : null}
      </BottomNavigation>
    </Box>
  );
}
