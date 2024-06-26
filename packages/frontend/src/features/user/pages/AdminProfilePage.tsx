import AsChildLink from "@/components/AsChildLink";
import { trpc } from "@/trpcClient";
import type { TabItem } from "@/types/TabItem";
import { Tab, Tabs } from "@mui/material";
import { Outlet, RouteApi } from "@tanstack/react-router";
import { useMemo } from "react";
import DefaultAppBar from "../../../components/DefaultAppBar";
import useRouteMatch from "../../../utils/useRouteMatch";

const routeApi = new RouteApi({ id: "/authedOnly/adminOnly/user/$userId" });

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const userQuery = trpc.users.getUser.useQuery(loaderData.userId, {
    initialData: loaderData.initialUser,
  });

  const tabs = useMemo<TabItem[]>(
    () => [
      {
        label: "Scancodes",
        to: "/user/$userId",
        params: {
          userId: loaderData.userId,
        },
      },
      {
        label: "Pending",
        to: "/user/$userId/pending",
        params: {
          userId: loaderData.userId,
        },
      },
    ],
    [loaderData.userId],
  );

  const currentTab = useRouteMatch(tabs);
  // console.log(currentTab);

  return (
    <>
      <DefaultAppBar
        title={`${userQuery.data?.username ?? "Loading"}'s Profile`}
      />
      <Tabs value={currentTab}>
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
