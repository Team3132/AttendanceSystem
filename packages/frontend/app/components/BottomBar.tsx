import type { TabItem } from "@/hooks/useTabIndex";
import { authQueryOptions } from "@/queries/auth.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
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
  return (
    <Suspense
      fallback={
        <LinkBottomNavigation tabs={regularItems} showLabels key="normalNav" />
      }
    >
      <BottomNavigation />
    </Suspense>
  );
}

function BottomNavigation() {
  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

  if (authStatusQuery.data.isAdmin) {
    return <LinkBottomNavigation tabs={adminItems} showLabels key="adminNav" />;
  }

  return (
    <LinkBottomNavigation tabs={regularItems} showLabels key="normalNav" />
  );
}
