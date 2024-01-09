import { useMemo } from "react";
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

const routeApi = new RouteApi({ id: "/adminOnly/user/$userId" });

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const userQuery = trpc.users.getUser.useQuery(loaderData.userId, {
    initialData: loaderData.initialUser,
  });

  const tabs: Array<TabItem> = useMemo(
    () =>
      [
        {
          label: "Scancodes",
          path: `/user/$userId/`,
        },
        {
          label: "Pending",
          path: `/user/$userId/pending`,
        },
        // {
        //   label: "Build Points",
        //   path: `/user/${loaderData.userId}/build-points`,
        // },
      ] satisfies TabItem[],
    []
  );

  const routes = useMemo(() => tabs.map((tab) => tab.path), [tabs]);

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
            href={tab.path.replace("$userId", loaderData.userId ?? "")}
            LinkComponent={LinkBehavior}
          />
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
