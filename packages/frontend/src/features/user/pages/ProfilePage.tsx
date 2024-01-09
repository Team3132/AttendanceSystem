import useRouteMatch from "../../../utils/useRouteMatch";
import DefaultAppBar from "../../../components/DefaultAppBar";
import { Tab, Tabs } from "@mui/material";
import { trpc } from "@/trpcClient";
import { Outlet, RouteApi } from "@tanstack/react-router";
import { RouterPaths } from "@/router";
import AsChildLink from "@/components/AsChildLink";

interface TabItem {
  label: string;
  icon?: React.ReactElement | string;
  path: RouterPaths;
}

const routeApi = new RouteApi({ id: "/authedOnly/profile" });
const tabs = [
  {
    label: "Scancodes",
    path: "/profile" as const,
  },
  {
    label: "Pending",
    path: "/profile/pending" as const,
  },
  // {
  //   label: "Build Points",
  //   path: "/profile/build-points",
  // },
] satisfies Array<TabItem>;

const routes = tabs.map((tab) => tab.path);

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const userQuery = trpc.users.getSelf.useQuery(undefined, {
    initialData: loaderData.initialUser,
  });

  const currentTab = useRouteMatch(routes);

  return (
    <>
      <DefaultAppBar
        title={`${userQuery.data?.username ?? "Loading"}'s Profile`}
      />
      <Tabs value={currentTab}>
        {tabs.map((tab) => (
          <AsChildLink to={tab.path}>
            <Tab key={tab.path} label={tab.label} value={tab.path} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
