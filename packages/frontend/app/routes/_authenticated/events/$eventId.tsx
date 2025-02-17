import LinkTabs from "@/components/LinkTabs";
import type { TabItem } from "@/hooks/useTabIndex";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Suspense, useMemo } from "react";

export const Route = createFileRoute("/_authenticated/events/$eventId")({
  loader: ({ context: { queryClient }, params: { eventId } }) => {
    queryClient.prefetchQuery(authQueryOptions.status());

    return queryClient.ensureQueryData(eventQueryOptions.eventDetails(eventId));
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData.title} - Details`,
      },
    ],
  }),
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

  const defaultTabs = useMemo(() => userTabs(eventId), [eventId]);

  return (
    <>
      <Suspense
        fallback={
          <LinkTabs
            variant="scrollable"
            scrollButtons="auto"
            tabs={defaultTabs}
          />
        }
      >
        <ProfileTabs />
      </Suspense>
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
