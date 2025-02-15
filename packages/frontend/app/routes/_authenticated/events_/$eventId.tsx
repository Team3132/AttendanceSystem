import LinkTabs from "@/components/LinkTabs";
import type { TabItem } from "@/hooks/useTabIndex";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
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
  loader: ({ context: { queryClient }, params: { eventId } }) => {
    queryClient.prefetchQuery(eventQueryOptions.eventDetails(eventId));
    queryClient.prefetchQuery(authQueryOptions.status());
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
  return (
    <>
      <ProfileTabs />
      <Outlet />
    </>
  );
}

function ProfileTabs() {
  const { eventId } = Route.useParams();

  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

  const tabs = useMemo<Array<TabItem>>(
    () =>
      authStatusQuery.data.isAdmin ? adminTabs(eventId) : userTabs(eventId),

    [eventId, authStatusQuery.data.isAdmin],
  );

  return <LinkTabs variant="scrollable" scrollButtons="auto" tabs={tabs} />;
}
