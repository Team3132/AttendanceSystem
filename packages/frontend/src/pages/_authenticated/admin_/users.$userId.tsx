import AsChildLink from "@/components/AsChildLink";
import DefaultAppBar from "@/components/DefaultAppBar";
import { usersQueryOptions } from "@/queries/users.queries";

import { TabItem } from "@/types/TabItem";
import { Tab, Tabs } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  Outlet,
  createFileRoute,
  useChildMatches,
} from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/admin_/users/$userId")({
  component: Component,
  loader: ({ params: { userId }, context: { queryClient } }) =>
    queryClient.ensureQueryData(usersQueryOptions.userDetails(userId)),
});

function Component() {
  const loaderData = Route.useLoaderData();

  const userQuery = useQuery({
    ...usersQueryOptions.userDetails(loaderData.id),
    initialData: loaderData,
  });

  const tabs = useMemo<TabItem[]>(
    () => [
      {
        label: "Scancodes",
        to: "/admin/users/$userId",
        params: {
          userId: userQuery.data.id,
        },
      },
      {
        label: "Pending",
        to: "/admin/users/$userId/pending",
        params: {
          userId: userQuery.data.id,
        },
      },
    ],
    [userQuery.data.id],
  );

  const currentChildren = useChildMatches();

  const matchingIndex = useMemo(
    () =>
      tabs.findIndex((tab) => {
        return currentChildren.some((child) => {
          return child.fullPath === tab.to;
        });
      }),
    [currentChildren, tabs],
  );

  return (
    <>
      <DefaultAppBar title={`${userQuery.data.username}'s Profile`} />
      <Tabs value={matchingIndex}>
        {tabs.map((tab, index) => (
          <AsChildLink to={tab.to} params={tab.params} key={tab.to}>
            <Tab key={tab.to} label={tab.label} value={index} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
