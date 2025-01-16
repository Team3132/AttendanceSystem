import AsChildLink from "@/components/AsChildLink";
import { authQueryOptions } from "@/queries/auth.queries";

import type { TabItem } from "@/types/TabItem";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useChildMatches } from "@tanstack/react-router";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  FaHouse,
  FaPeopleGroup,
  FaRegCalendar,
  FaHouseLock,
} from "react-icons/fa6";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const { isAuthenticated } = await queryClient.ensureQueryData(
      authQueryOptions.status()
    );
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        // search: {
        //   redirect: location.href,
        // },
      });
    }
  },
  loader: async ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(authQueryOptions.status()),
  component: Component,
});

function Component() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Outlet />
      <BottomBar />
    </Box>
  );
}

function BottomBar() {
  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

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
              to: "/leaderboard",
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
              to: "/leaderboard",
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
    [authStatusQuery.data.isAdmin]
  );

  const currentChildren = useChildMatches();

  const matchingIndex = useMemo(
    () =>
      routes.findIndex((tab) => {
        return currentChildren.some((child) => {
          return child.fullPath === tab.to;
        });
      }),
    [currentChildren, routes]
  );

  return (
    <BottomNavigation showLabels value={matchingIndex}>
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
  );
}
