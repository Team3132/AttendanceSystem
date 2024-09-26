import AsChildLink from "@/components/AsChildLink";
import { authGuard } from "@/server/auth/authGuard";
import { trpc } from "@/trpcClient";
import { TabItem } from "@/types/TabItem";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { useMemo } from "react";
import {
  FaHouse,
  FaPeopleGroup,
  FaRegCalendar,
  FaHouseLock,
} from "react-icons/fa6";

const serverAuth = async () => {
  'use server';

  const { session, user } = await authGuard({ successRedirect: "/" });

  return { session, user };
}

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    'use server';
    serverAuth();
  },
  component: Component,
});

function Component() {
  const authStatus = Route.useLoaderData();

  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
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
