import { useMemo } from "react";
import useRouteMatch from "../../../utils/useRouteMatch";
import DefaultAppBar from "../../../components/DefaultAppBar";
import { Tab, Tabs } from "@mui/material";
import { trpc } from "@/trpcClient";
import { Outlet, RouteApi } from "@tanstack/react-router";
import AsChildLink from "@/components/AsChildLink";
import { TabItem } from "@/types/TabItem";

const routeApi = new RouteApi({ id: "/authedOnly/adminOnly/user/$userId" });

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const userQuery = trpc.users.getUser.useQuery(loaderData.userId, {
    initialData: loaderData.initialUser,
  });

  const tabs = useMemo(
    () =>
      [
        {
          label: "Scancodes",
          to: `/user/$userId` as const,
        },
        {
          label: "Pending",
          to: `/user/$userId/pending` as const,
        },
        // {
        //   label: "Build Points",
        //   path: `/user/${loaderData.userId}/build-points`,
        // },
      ] satisfies TabItem[],
    []
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
          <AsChildLink
            to={tab.to}
            params={{
              userId: loaderData.userId,
            }}
            key={tab.to}
          >
            <Tab key={tab.to} label={tab.label} value={index} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
