import { Container, Paper, Stack, Tab, Tabs } from "@mui/material";
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
            />
          ))}
        </Tabs>
        <Paper sx={{ p: 2, textAlign: "center", flex: 1, width: "100%" }}>
          <Stack gap={2} sx={{ height: "100%", display: "flex" }}>
            <Outlet />
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
