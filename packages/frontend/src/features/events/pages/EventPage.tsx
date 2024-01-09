import { useMemo } from "react";
import useRouteMatch from "../../../utils/useRouteMatch";
import { Tab, Tabs } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import { DateTime } from "luxon";
import { trpc } from "@/trpcClient";
import { RouterPaths } from "@/router";
import { Outlet, RouteApi } from "@tanstack/react-router";
import AsChildLink from "@/components/AsChildLink";

const routeApi = new RouteApi({
  id: "/authedOnly/events/$eventId",
});

interface TabItem {
  label: string;
  icon?: React.ReactElement | string;
  path: RouterPaths;
}

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const { initialAuth, initialEvent } = loaderData;

  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
    initialData: initialAuth,
  });

  const eventQuery = trpc.events.getEvent.useQuery(initialEvent.id, {
    initialData: initialEvent,
  });

  const tabs = useMemo(
    () =>
      !authStatusQuery.data.isAdmin
        ? ([
            {
              label: "Details",
              path: "/events/$eventId",
            },
            {
              label: "Check In",
              path: "/events/$eventId/check-in",
            },
          ] satisfies Array<TabItem>)
        : ([
            {
              label: "Details",
              path: "/events/$eventId",
            },
            {
              label: "Check In",
              path: "/events/$eventId/check-in",
            },
            {
              label: "QR Code",
              path: "/events/$eventId/qr-code",
            },
          ] satisfies Array<TabItem>),
    [authStatusQuery.data.isAdmin]
  );

  const routes = useMemo(() => tabs.map((tab) => tab.path), [tabs]);

  const currentTab = useRouteMatch(routes);

  return (
    <>
      <DefaultAppBar
        title={`${DateTime.fromISO(eventQuery.data.startDate).toLocaleString(
          DateTime.DATE_SHORT
        )} - ${eventQuery.data.title}`}
      />
      <Tabs value={currentTab} variant="scrollable" scrollButtons="auto">
        {tabs.map((tab) => (
          <AsChildLink
            to={tab.path}
            params={{
              eventId: eventQuery.data.id,
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
