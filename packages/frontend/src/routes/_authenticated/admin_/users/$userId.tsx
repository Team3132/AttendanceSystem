import LinkTabs from "@/components/LinkTabs";
import type { TabItem } from "@/hooks/useTabIndex";
import { usersQueryOptions } from "@/queries/users.queries";

import { Outlet } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute({
  component: Component,
  loader: ({ params: { userId }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(usersQueryOptions.userDetails(userId));
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.username}'s Profile`,
      },
    ],
  }),
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
          userId,
        },
      },
      {
        label: "Pending",
        to: "/admin/users/$userId/pending",
        params: {
          userId,
        },
      },
      {
        label: "Sessions",
        to: "/admin/users/$userId/sessions",
        params: {
          userId,
        },
      },
    ],
    [userId],
  );

  return <LinkTabs tabs={tabs} />;
}
