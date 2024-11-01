import AsChildLink from "@/components/AsChildLink";
import { authQueryOptions } from "@/queries/auth.queries";

import { TabItem } from "@/types/TabItem";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { queryOptions, useQuery } from "@tanstack/react-query";
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
    const { isAuthenticated, isAdmin } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    return {
      isAdmin,
    };
  },
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(authQueryOptions.status()),
  component: Component,
});

function Component() {
  const authStatus = Route.useLoaderData();

  const authStatusQuery = useQuery({
    ...authQueryOptions.status(),
    initialData: authStatus,
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
    [authStatusQuery.data.isAdmin],
  );

  const currentChildren = useChildMatches();

  const matchingIndex = useMemo(
    () =>
      routes.findIndex((tab) => {
        return currentChildren.some((child) => {
          return child.fullPath === tab.to;
        });
      }),
    [currentChildren, routes],
  );

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
        // value={currentTab}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        value={matchingIndex}
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
    </Box>
  );
}
