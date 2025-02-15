import type { TabItem } from "@/hooks/useTabIndex";
import { authQueryOptions } from "@/queries/auth.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  FaHouse,
  FaHouseLock,
  FaPeopleGroup,
  FaRegCalendar,
} from "react-icons/fa6";
import LinkBottomNavigation from "./LinkBottomNavigation";

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

  const tabs = useMemo<TabItem[]>(
    () => (authStatusQuery.data.isAdmin ? adminItems : regularItems),
    [authStatusQuery.data.isAdmin],
  );

  return <LinkBottomNavigation tabs={tabs} showLabels />;
}
