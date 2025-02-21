import LinkTabs from "@/components/LinkTabs";
import type { TabItem } from "@/hooks/useTabIndex";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";
import { parseDate } from "@/utils/date";
import { Skeleton, Stack, Typography, styled } from "@mui/material";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { DateTime } from "luxon";
import { Suspense, useMemo } from "react";

export const Route = createFileRoute("/_authenticated/events/$eventId")({
  loader: ({ context: { queryClient }, params: { eventId } }) => {
    queryClient.prefetchQuery(authQueryOptions.status());

    queryClient.prefetchQuery(eventQueryOptions.eventDetails(eventId));
  },
  head: () => ({
    meta: [
      {
        title: "Event - RSVPs",
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
      <Suspense fallback={<EventTitleSkeleton />}>
        <EventTitle />
      </Suspense>
      <Suspense
        fallback={<LinkTabs scrollButtons="auto" tabs={defaultTabs} centered />}
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

  return <LinkTabs scrollButtons="auto" tabs={tabs} centered />;
}

const generateCheckinCheckout = (startTime: string, endTime: string) => {
  const checkinIso = parseDate(startTime);
  const checkoutIso = parseDate(endTime);

  const checkin = checkinIso ? DateTime.fromISO(checkinIso) : null;
  const checkout = checkoutIso ? DateTime.fromISO(checkoutIso) : null;

  if (!checkin || !checkout) return "Missing Dates";

  const isSameDay =
    checkin && checkout ? checkin.hasSame(checkout, "day") : false;

  const hours = checkout.diff(checkin, "hours").toHuman();

  if (isSameDay) {
    // If the checkin and checkout are on the same day, show the time range
    return `${checkin.toLocaleString(
      DateTime.DATETIME_MED_WITH_WEEKDAY,
    )} - ${checkout.toLocaleString(DateTime.TIME_SIMPLE)} (${hours})`;
  }

  // If the checkin and checkout are not on the same day, show the date range
  return `${checkin.toLocaleString(
    DateTime.DATETIME_MED,
  )} - ${checkout.toLocaleString(DateTime.DATETIME_MED)} (${hours})`;
};

function EventTitle() {
  const { eventId } = Route.useParams();
  const eventData = useSuspenseQuery(eventQueryOptions.eventDetails(eventId));

  const dateText = useMemo(
    () =>
      generateCheckinCheckout(eventData.data.startDate, eventData.data.endDate),
    [eventData.data.endDate, eventData.data.startDate],
  );

  return (
    <Stack p={2} textAlign={"center"}>
      <Typography variant="h4">{eventData.data.title}</Typography>
      <Typography variant="subtitle1">{dateText}</Typography>
    </Stack>
  );
}

function EventTitleSkeleton() {
  return (
    <Stack p={2} textAlign={"center"}>
      <Typography variant="h4">
        <CenteredSkeleton width={300} />
      </Typography>
      <Typography variant="subtitle1">
        <CenteredSkeleton width={230} />
      </Typography>
    </Stack>
  );
}

const CenteredSkeleton = styled(Skeleton)(() => ({
  margin: "0 auto",
}));
