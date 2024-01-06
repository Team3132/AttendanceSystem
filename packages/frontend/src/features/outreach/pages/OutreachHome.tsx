import { Container, Paper, Tab, Tabs } from "@mui/material";
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
  disabled?: boolean;
}

const tabs: Array<TabItem> = [
  {
    label: "Outreach",
    path: "/leaderboard/outreach",
  },
  {
    label: "Build Points",
    path: "/leaderboard/build-points",
    disabled: true,
  },
];

const routes = tabs.map((tab) => tab.path);

export function Component() {
  const routeMatch = useRouteMatch(routes);

  const currentTab = routeMatch?.pattern.path;

  return (
    <>
      <DefaultAppBar title="Leaderboards" />
      <Container
        sx={{
          my: 2,
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tabs value={currentTab}>
          {tabs.map((tab) => (
            <Tab
              key={tab.path}
              label={tab.label}
              icon={tab.icon}
              value={tab.path}
              href={tab.path}
              LinkComponent={LinkBehavior}
              disabled={tab.disabled}
            />
          ))}
        </Tabs>
        <Paper
          sx={{
            p: 2,
            textAlign: "center",
            // flex: 1,
            height: 0,
            flexGrow: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </>
  );
}
