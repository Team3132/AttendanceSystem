import { Container, Paper, Tab, Tabs } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import useRouteMatch from "@/utils/useRouteMatch";
import { RouterPaths } from "@/router";
import AsChildLink from "@/components/AsChildLink";
import { Outlet } from "@tanstack/react-router";

interface TabItem {
  label: string;
  icon?: React.ReactElement | string;
  path: RouterPaths;
  disabled?: boolean;
}

const tabs = [
  {
    label: "Outreach",
    path: "/leaderboard/outreach" as const,
  },
  {
    label: "Build Points",
    path: "/leaderboard/build-points" as const,
    disabled: true,
  },
] satisfies Array<TabItem>;

const routes = tabs.map((tab) => tab.path);

export function Component() {
  const currentTab = useRouteMatch(routes);

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
            <AsChildLink to={tab.path}>
              <Tab
                key={tab.path}
                label={tab.label}
                value={tab.path}
                disabled={tab.disabled}
              />
            </AsChildLink>
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
