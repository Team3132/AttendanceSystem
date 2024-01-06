import { Outlet, useLoaderData } from "react-router-dom";
import ensureAuth from "../../auth/utils/ensureAuth";
import useRouteMatch from "../../../utils/useRouteMatch";
import DefaultAppBar from "../../../components/DefaultAppBar";
import { Tab, Tabs } from "@mui/material";
import LinkBehavior from "../../../utils/LinkBehavior";
import { queryUtils } from "@/trpcClient";
import { trpc } from "@/trpcClient";

interface TabItem {
  label: string;
  icon?: React.ReactElement | string;
  path: string;
}

export async function loader() {
  const initialAuthStatus = await ensureAuth();

  const initialUser = await queryUtils.users.getSelf.ensureData();

  return {
    initialUser,
    initialAuthStatus,
  };
}

const tabs: Array<TabItem> = [
  {
    label: "Scancodes",
    path: "/profile",
  },
  {
    label: "Pending",
    path: "/profile/pending",
  },
  {
    label: "Build Points",
    path: "/profile/build-points",
  },
];

const routes = tabs.map((tab) => tab.path);

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const userQuery = trpc.users.getSelf.useQuery(undefined, {
    initialData: loaderData.initialUser,
  });

  const routeMatch = useRouteMatch(routes);

  const currentTab = routeMatch?.pattern.path;

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
