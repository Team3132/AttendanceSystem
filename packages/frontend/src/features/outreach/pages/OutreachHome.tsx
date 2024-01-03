import { Tab, Tabs } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import ensureAuth from "@/features/auth/utils/ensureAuth";
import { queryUtils } from "@/trpcClient";
import useRouteMatch from "@/utils/useRouteMatch";
import LinkBehavior from "@/utils/LinkBehavior";
import { Outlet } from "react-router-dom";

export async function loader() {
  const initialAuth = await ensureAuth();

  await queryUtils.outreach.outreachLeaderboard.prefetchInfinite({
    limit: 10,
  });

  return {
    initialAuth,
  };
}

interface TabItem {
  label: string;
  icon?: React.ReactElement | string;
  path: string;
}

const tabs: Array<TabItem> = [
  {
    label: "Outreach",
    path: "/leaderboard/outreach",
  },
  {
    label: "Build Points",
    path: "/leaderboard/build-points",
  },
];

const routes = tabs.map((tab) => tab.path);

export function Component() {
  const routeMatch = useRouteMatch(routes);

  const currentTab = routeMatch?.pattern.path;

  return (
    <>
      <DefaultAppBar title="Leaderboards" />
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
