import { LinkTab } from "@/components/LinkTab";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";

import type { TabItem } from "@/types/TabItem";
import { Tabs } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Outlet,
  createFileRoute,
  useChildMatches,
} from "@tanstack/react-router";
import { DateTime } from "luxon";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/events_/$eventId")({
  beforeLoad: ({ context: { queryClient }, params: { eventId } }) => ({
    getTitle: async () => {
      const eventData = await queryClient.ensureQueryData(
        eventQueryOptions.eventDetails(eventId),
      );
      return `${DateTime.fromMillis(
        Date.parse(eventData.startDate),
      ).toLocaleString(DateTime.DATE_SHORT)} - ${eventData.title}`;
    },
  }),
  loader: async ({ context: { queryClient }, params: { eventId } }) => {
    await queryClient.prefetchQuery(eventQueryOptions.eventDetails(eventId));
    await queryClient.prefetchQuery(authQueryOptions.status());
  },

  component: Component,
});

const userTabs = (eventId: string): TabItem[] => [
  {
    label: "Details",
    to: "/events/$eventId",
    params: {
      eventId: eventId,
    },
  },
  {
    label: "Check In",
    to: "/events/$eventId/check-in",
  },
];

const adminTabs = (eventId: string): TabItem[] =>
  userTabs(eventId).concat([
    {
      label: "QR Code",
      to: "/events/$eventId/qr-code",
    },
  ]);

function Component() {
  const { eventId } = Route.useParams();

  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

  const tabs = useMemo<Array<TabItem>>(
    () =>
      authStatusQuery.data.isAdmin ? adminTabs(eventId) : userTabs(eventId),

    [eventId, authStatusQuery.data.isAdmin],
  );

  const currentChildren = useChildMatches();

  const matchingIndex = useMemo(() => {
    const tabIndex = tabs.findIndex((tab) => {
      return currentChildren.some((child) => {
        return child.fullPath === tab.to;
      });
    });
    return tabIndex === -1 ? 0 : tabIndex;
  }, [currentChildren, tabs]);

  return (
    <>
      <Tabs variant="scrollable" scrollButtons="auto" value={matchingIndex}>
        {tabs.map((tab, index) => (
          <LinkTab
            to={tab.to}
            params={tab.params}
            key={tab.label}
            label={tab.label}
            value={index}
          />
        ))}
      </Tabs>
      <Outlet />
    </>
  );
}
