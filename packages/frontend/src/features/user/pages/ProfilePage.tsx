import useRouteMatch from "../../../utils/useRouteMatch";
import DefaultAppBar from "../../../components/DefaultAppBar";
import { Tab, Tabs } from "@mui/material";
import { trpc } from "@/trpcClient";
import { Outlet, RouteApi } from "@tanstack/react-router";
import AsChildLink from "@/components/AsChildLink";
import { TabItem } from "@/types/TabItem";

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
