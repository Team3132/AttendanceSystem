import { LoaderFunctionArgs, Outlet, useLoaderData } from "react-router-dom";
import ensureAuth from "../../auth/utils/ensureAuth";
import authApi from "../../../api/query/auth.api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import useRouteMatch from "../../../utils/useRouteMatch";
import { Tab, Tabs } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import queryClient from "../../../queryClient";
import eventApi from "../../../api/query/event.api";
import { z } from "zod";
import { DateTime } from "luxon";
import LinkBehavior from "../../../utils/LinkBehavior";

const EventParamsSchema = z.object({
  eventId: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const { eventId } = EventParamsSchema.parse(params);

  const initialAuthStatus = await ensureAuth();

  const initialEventData = await queryClient.ensureQueryData(
    eventApi.getEvent(eventId),
  );

  return {
    initialAuthStatus,
    initialEventData,
  };
}

interface TabItem {
  label: string;
  icon?: React.ReactElement | string;
  path: string;
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { initialAuthStatus } = loaderData;

  const authStatusQuery = useQuery({
    ...authApi.getAuthStatus,
    initialData: initialAuthStatus,
  });

  const eventQuery = useQuery({
    ...eventApi.getEvent(loaderData.initialEventData.id),
    initialData: loaderData.initialEventData,
  });

  const tabs = useMemo<Array<TabItem>>(
    () =>
      !authStatusQuery.data.isAdmin
        ? [
            {
              label: "Details",
              path: "/events/:eventId",
            },
            {
              label: "Check In",
              path: "/events/:eventId/check-in",
            },
          ]
        : [
            {
              label: "Details",
              path: "/events/:eventId",
            },
            {
              label: "Check In",
              path: "/events/:eventId/check-in",
            },
            {
              label: "Admin",
              path: "/events/:eventId/admin",
            },
          ],
    [authStatusQuery.data.isAdmin],
  );

  const routes = useMemo(() => tabs.map((tab) => tab.path), [tabs]);

  const routeMatch = useRouteMatch(routes);

  const currentTab = routeMatch?.pattern.path;

  return (
    <>
      <DefaultAppBar
        title={`${DateTime.fromISO(eventQuery.data.startDate).toLocaleString(
          DateTime.DATE_SHORT,
        )} - ${eventQuery.data.title}`}
      />
      <Tabs
        value={currentTab}
        variant="scrollable"
        scrollButtons="auto"
        centered
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            label={tab.label}
            icon={tab.icon}
            value={tab.path}
            href={tab.path.replace(":eventId", eventQuery.data.id)}
            LinkComponent={LinkBehavior}
          />
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
