import AsChildLink from "@/components/AsChildLink";
import { trpc } from "@/trpcClient";
import { Tab, Tabs } from "@mui/material";
import type { NoInfer } from "@tanstack/react-query";
import {
  type AnyRoute,
  Outlet,
  type RegisteredRouter,
  RouteApi,
  type RoutePaths,
  type ToPathOption,
} from "@tanstack/react-router";
import type { PathParamOptions } from "@tanstack/react-router";
import type { ResolveRelativePath } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { useMemo } from "react";
import DefaultAppBar from "../../../components/DefaultAppBar";
import useRouteMatch from "../../../utils/useRouteMatch";

const routeApi = new RouteApi({
  id: "/authedOnly/events/$eventId",
});

type TabItem<
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
> = {
  label: string;
  icon?: React.ReactElement | string;
  to: ToPathOption<TRouteTree, TFrom, TTo>;
} & PathParamOptions<TRouteTree, TFrom, TTo>;

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
        ? ([
            {
              label: "Details",
              to: "/events/$eventId",
              params: {
                eventId: eventQuery.data.id,
              },
            },
            {
              label: "Check In",
              to: "/events/$eventId/check-in",
            },
          ] as TabItem[])
        : ([
            {
              label: "Details",
              to: "/events/$eventId",
              params: {
                eventId: eventQuery.data.id,
              },
            },
            {
              label: "Check In",
              to: "/events/$eventId/check-in",
              params: {
                eventId: eventQuery.data.id,
              },
            },
            {
              label: "QR Code",
              to: "/events/$eventId/qr-code",
              params: {
                eventId: eventQuery.data.id,
              },
            },
          ] as TabItem[]),
    [authStatusQuery.data.isAdmin, eventQuery.data.id],
  );

  const currentTab = useRouteMatch(tabs);

  return (
    <>
      <DefaultAppBar
        title={`${DateTime.fromMillis(
          Date.parse(eventQuery.data.startDate),
        ).toLocaleString(DateTime.DATE_SHORT)} - ${eventQuery.data.title}`}
      />
      <Tabs value={currentTab} variant="scrollable" scrollButtons="auto">
        {tabs.map((tab, index) => (
          <AsChildLink to={tab.to} params={tab.params}>
            <Tab key={tab.to} label={tab.label} value={index} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
