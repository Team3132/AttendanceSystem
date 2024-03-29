import AsChildLink from "@/components/AsChildLink";
import { trpc } from "@/trpcClient";
import type { TabItem } from "@/types/TabItem";
import { Tab, Tabs } from "@mui/material";
import { Outlet, RouteApi } from "@tanstack/react-router";
import DefaultAppBar from "../../../components/DefaultAppBar";
import useRouteMatch from "../../../utils/useRouteMatch";

const routeApi = new RouteApi({ id: "/authedOnly/profile" });
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

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const userQuery = trpc.users.getSelf.useQuery(undefined, {
    initialData: loaderData.initialUser,
  });

  const currentTab = useRouteMatch(tabs);

  return (
    <>
      <DefaultAppBar
        title={`${userQuery.data?.username ?? "Loading"}'s Profile`}
      />
      <Tabs value={currentTab}>
        {tabs.map((tab, index) => (
          <AsChildLink to={tab.to} params={tab.params}>
            <Tab key={tab.to} label={tab.label} value={index} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
