import LinkTabs from "@/components/LinkTabs";
import { usersQueryOptions } from "@/queries/users.queries";

import type { TabItem } from "@/types/TabItem";
import { Outlet, createFileRoute } from "@tanstack/react-router";
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
  loader: ({ params: { userId }, context: { queryClient } }) => {
    queryClient.prefetchQuery(usersQueryOptions.userDetails(userId));
  },
});

function Component() {
  return (
    <>
      <ProfileTabs />
      <Outlet />
    </>
  );
}

function ProfileTabs() {
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

  return <LinkTabs tabs={tabs} />;
}
