import AsChildLink from "@/components/AsChildLink";
import DefaultAppBar from "@/components/DefaultAppBar";
import { trpc } from "@/trpcClient";
import { TabItem } from "@/types/TabItem";
import { Tab, Tabs } from "@mui/material";
import { Outlet, createFileRoute, useChildMatches } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Component,
  loader: async ({ context: { queryUtils } }) =>
    queryUtils.users.getSelf.ensureData(),
});

const tabs: Array<TabItem> = [
  {
    label: "Scancodes",
    to: "/profile",
  },
  {
    label: "Pending",
    to: "/profile/pending",
  },
];

function Component() {
  const loaderData = Route.useLoaderData();

  const userQuery = trpc.users.getSelf.useQuery(undefined, {
    initialData: loaderData,
  });

  const currentChildren = useChildMatches();

  const matchingIndex = useMemo(() => tabs.findIndex((tab) => {
    return currentChildren.some((child) => {
      return child.fullPath === tab.to
    })
  }), [currentChildren])

  return (
    <>
      <DefaultAppBar title={`${userQuery.data.username}'s Profile`} />
      <Tabs value={matchingIndex}>
        {tabs.map((tab, index) => (
          <AsChildLink to={tab.to} params={tab.params} key={tab.label}>
            <Tab key={tab.to} label={tab.label} value={index} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
