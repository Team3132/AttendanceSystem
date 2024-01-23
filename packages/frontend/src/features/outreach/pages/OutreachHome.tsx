import { Container, Paper, Tab, Tabs } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import useRouteMatch from "@/utils/useRouteMatch";
import AsChildLink from "@/components/AsChildLink";
import { Outlet } from "@tanstack/react-router";
import { TabItem } from "@/types/TabItem";

const tabs = [
  {
    label: "Outreach",
    to: "/leaderboard/outreach" as const,
    params: {},
  },
  {
    label: "Build Points",
    to: "/leaderboard/build-points" as const,
    params: {},
    disabled: true,
  },
] satisfies Array<TabItem>;

export function Component() {
  const currentTab = useRouteMatch(tabs);

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
          {tabs.map((tab, index) => (
            <AsChildLink to={tab.to} key={tab.to}>
              <Tab
                key={tab.to}
                label={tab.label}
                value={index}
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
