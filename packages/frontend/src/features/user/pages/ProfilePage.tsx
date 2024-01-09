import useRouteMatch from "../../../utils/useRouteMatch";
import DefaultAppBar from "../../../components/DefaultAppBar";
import { Tab, Tabs } from "@mui/material";
import LinkBehavior from "../../../utils/LinkBehavior";
import { trpc } from "@/trpcClient";
import { Outlet, RouteApi } from "@tanstack/react-router";
import { RouterPaths } from "@/router";

interface TabItem {
  label: string;
  icon?: React.ReactElement | string;
  path: RouterPaths;
}

const routeApi = new RouteApi({ id: "/authedOnly/profile" });
const tabs: Array<TabItem> = [
  {
    label: "Scancodes",
    path: "/profile",
  },
  {
    label: "Pending",
    path: "/profile/pending",
  },
  // {
  //   label: "Build Points",
  //   path: "/profile/build-points",
  // },
];

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
          <Tab
            key={tab.path}
            label={tab.label}
            icon={tab.icon}
            value={tab.path}
            href={tab.path}
            LinkComponent={LinkBehavior}
          />
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
