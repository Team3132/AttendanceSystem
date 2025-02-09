import { LinkTab } from "@/components/LinkTab";
import { usersQueryOptions } from "@/queries/users.queries";

import type { TabItem } from "@/types/TabItem";
import { Tabs } from "@mui/material";
import {
  Outlet,
  createFileRoute,
  useChildMatches,
} from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/admin_/users/$userId")({
  beforeLoad: ({ params: { userId }, context: { queryClient } }) => {
    return {
      getTitle: async () => {
        const user = await queryClient.ensureQueryData(
          usersQueryOptions.userDetails(userId),
        );
        return `${user.username}'s Profile`;
      },
    };
  },
  component: Component,
  loader: ({ params: { userId }, context: { queryClient } }) =>
    queryClient.prefetchQuery(usersQueryOptions.userDetails(userId)),
});

function Component() {
  const { userId } = Route.useParams();

  const tabs = useMemo<TabItem[]>(
    () => [
      {
        label: "Scancodes",
        to: "/admin/users/$userId",
        params: {
          userId: userId,
        },
      },
      {
        label: "Pending",
        to: "/admin/users/$userId/pending",
        params: {
          userId: userId,
        },
      },
    ],
    [userId],
  );

  const currentChildren = useChildMatches();

  const matchingIndex = useMemo(() => {
    const currentTabIndex = tabs.findIndex((tab) =>
      currentChildren.some((child) => child.fullPath === tab.to),
    );

    return currentTabIndex === -1 ? 0 : currentTabIndex;
  }, [currentChildren, tabs]);

  return (
    <>
      <Tabs value={matchingIndex}>
        {tabs.map((tab, index) => (
          <LinkTab
            to={tab.to}
            params={tab.params}
            key={tab.to}
            label={tab.label}
            value={index}
          />
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
