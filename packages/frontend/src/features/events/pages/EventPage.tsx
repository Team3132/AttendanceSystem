import { useMemo } from "react";
import useRouteMatch from "../../../utils/useRouteMatch";
import { Tab, Tabs } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import { DateTime } from "luxon";
import { trpc } from "@/trpcClient";
import { RouterPaths } from "@/router";
import {
  AnyRoute,
  Outlet,
  RegisteredRouter,
  Route,
  RouteApi,
  RouteByPath,
  RoutePaths,
  ToOptions,
  ToPathOption,
} from "@tanstack/react-router";
import AsChildLink from "@/components/AsChildLink";
import { PathParamOptions } from "@tanstack/react-router";
import { ResolveRelativePath } from "@tanstack/react-router";
import { NoInfer } from "@tanstack/react-query";

const routeApi = new RouteApi({
  id: "/authedOnly/events/$eventId",
});

type TabItem<
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
  TResolved = ResolveRelativePath<TFrom, NoInfer<TTo>>,
> = {
  label: string;
  icon?: React.ReactElement | string;
  to: ToPathOption<TRouteTree, TFrom, TTo>;
} & PathParamOptions<TRouteTree, TFrom, TTo, TResolved>;

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
              to: "/events/$eventId",
              params: {
                eventId: eventQuery.data.id,
              },
            },
            {
              label: "Check In",
              to: "/events/$eventId/check-in",
              params: {},
            } satisfies TabItem,
          ] satisfies Array<TabItem>)
        : ([
            {
              label: "Details",
              to: "/events/$eventId",
            },
            {
              label: "Check In",
              to: "/events/$eventId/check-in",
            },
            {
              label: "QR Code",
              to: "/events/$eventId/qr-code",
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
            activeProps={{}}
          >
            <Tab key={tab.path} label={tab.label} value={tab.path} />
          </AsChildLink>
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
