import { useMemo } from "react";
import useRouteMatch from "../../../utils/useRouteMatch";
import { Tab, Tabs } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import { DateTime } from "luxon";
import LinkBehavior from "../../../utils/LinkBehavior";
import { trpc } from "@/trpcClient";
import { RouterPaths } from "@/router";
import { Outlet, RouteApi } from "@tanstack/react-router";

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

  const tabs = useMemo<Array<TabItem>>(
    () =>
      !authStatusQuery.data.isAdmin
        ? [
            {
              label: "Details",
              path: "/events/$eventId",
            },
            {
              label: "Check In",
              path: "/events/$eventId/check-in",
            },
          ]
        : [
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
          ],
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
          <Tab
            key={tab.path}
            label={tab.label}
            icon={tab.icon}
            value={tab.path}
            href={tab.path.replace("$eventId", eventQuery.data.id)}
            LinkComponent={LinkBehavior}
          />
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
