import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/table-core";
import { Duration } from "luxon";
import type { z } from "zod";

import Datatable from "@/components/Datatable";
import InfiniteDatatable from "@/components/InfiniteDatatable";
import { leaderboardQueryOptions } from "@/queries/outreach.queries";
import type { LeaderBoardUser } from "@/server/schema/LeaderboardSchema";
import { Skeleton, Stack } from "@mui/material";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";

type LeaderboardUser = z.infer<typeof LeaderBoardUser>;

const columnHelper = createColumnHelper<LeaderboardUser>();

const roundDuration = (duration: Duration) => {
  const millis = duration.toMillis();
  // round to the nearest minute
  const rounded = Math.round(millis / 60000) * 60000;
  const hours = Math.floor(rounded / 3600000);
  const minutes = Math.floor((rounded % 3600000) / 60000);
  return Duration.fromObject({ hours, minutes });
};

const columns = [
  columnHelper.accessor("rank", {
    header: "Rank",
    maxSize: 50,
  }),
  columnHelper.accessor("username", {
    header: "Username",
  }),
  columnHelper.accessor("duration", {
    header: "Outreach Hours",
    cell: (props) => {
      return roundDuration(Duration.fromISO(props.getValue())).toHuman();
    },
  }),
];

const skeletonColumns = [
  columnHelper.accessor("rank", {
    header: "Rank",
    maxSize: 50,
    cell: () => <Skeleton />,
  }),
  columnHelper.accessor("username", {
    header: "Username",
    cell: () => <Skeleton />,
  }),
  columnHelper.accessor("duration", {
    header: "Outreach Hours",
    cell: () => <Skeleton />,
  }),
];

export const Route = createFileRoute("/_authenticated/leaderboard")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchInfiniteQuery(leaderboardQueryOptions({ limit: 10 }));
  },
  head: () => ({
    meta: [
      {
        title: "Leaderboard",
      },
    ],
  }),
  component: Component,
});

function Component() {
  return (
    <Stack gap={2} sx={{ height: "100%", display: "flex" }}>
      <Suspense fallback={<SkeletonDataTable />}>
        <LeadboardDataTable />
      </Suspense>
    </Stack>
  );
}

function LeadboardDataTable() {
  const leaderboardQuery = useSuspenseInfiniteQuery(
    leaderboardQueryOptions({
      limit: 10,
    }),
  );

  const flatResults = useMemo(
    () => leaderboardQuery.data.pages.flatMap((page) => page.items),
    [leaderboardQuery.data],
  );

  const totalRowCount = useMemo(
    () => leaderboardQuery.data.pages.at(-1)?.total ?? 0,
    [leaderboardQuery.data],
  );

  return (
    <InfiniteDatatable
      scrollRestorationId="leaderboard"
      columns={columns}
      data={flatResults}
      fetchNextPage={leaderboardQuery.fetchNextPage}
      isFetching={leaderboardQuery.isFetching}
      totalDBRowCount={totalRowCount}
      fixedHeight={53}
      sx={{
        flex: 1,
      }}
    />
  );
}

const skeletonLength = 10;

const skeletonData: LeaderboardUser[] = new Array(skeletonLength)
  .fill(null)
  .map((_, i) => ({
    duration: "",
    rank: i + 1,
    username: "",
    userId: "",
  }));

function SkeletonDataTable() {
  return (
    <Datatable
      columns={skeletonColumns}
      data={skeletonData}
      sx={{
        flex: 1,
      }}
    />
  );
}
