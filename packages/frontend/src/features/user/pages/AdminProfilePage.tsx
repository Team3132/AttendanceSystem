import { useMemo } from "react";
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

const routeApi = new RouteApi({ id: "/adminOnly/user/$userId" });

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
          path: `/user/$userId/` as const,
        },
        {
          label: "Pending",
          path: `/user/$userId/pending` as const,
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
          <AsChildLink
            to={tab.path}
            params={{
              userId: loaderData.userId,
            }}
          >
            <Tab key={tab.path} label={tab.label} value={tab.path} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
