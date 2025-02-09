import { authQueryOptions } from "@/queries/auth.queries";
import type { TabItem } from "@/types/TabItem";
import { BottomNavigation } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useChildMatches } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  FaHouse,
  FaHouseLock,
  FaPeopleGroup,
  FaRegCalendar,
} from "react-icons/fa6";
import { BottomNavigationLink } from "./BottomNavigationLink";

const regularItems: TabItem[] = [
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
];

const adminItems: TabItem[] = regularItems.concat({
  to: "/admin",
  label: "Admin",
  icon: <FaHouseLock />,
});

export default function BottomBar() {
  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

  const routes = useMemo<TabItem[]>(
    () => (authStatusQuery.data.isAdmin ? adminItems : regularItems),
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
    <BottomNavigation showLabels value={matchingIndex}>
      {routes.map((route, index) => (
        <BottomNavigationLink
          label={route.label}
          icon={route.icon}
          value={index}
          to={route.to}
          params={route.params}
          key={route.label}
        />
      ))}
    </BottomNavigation>
  );
}
