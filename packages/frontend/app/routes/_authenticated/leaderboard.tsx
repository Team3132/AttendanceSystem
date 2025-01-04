import { Outlet, createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/table-core";
import { Duration } from "luxon";
import type { LeaderBoardUser as LeaderboardUserSchema } from "@/api/schema";
import { z } from "zod";

import { useMemo } from "react";
import { Container, Paper, Stack, Typography } from "@mui/material";
import Datatable from "@/components/DataTable";
import DefaultAppBar from "@/components/DefaultAppBar";
import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { leaderboardQueryOptions } from "@/queries/outreach.queries";

type LeaderboardUser = z.infer<typeof LeaderboardUserSchema>;

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

export const Route = createFileRoute("/_authenticated/leaderboard")({
  component: Component,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchInfiniteQuery(
      leaderboardQueryOptions({ limit: 10 }),
    );
  },
  head: () => ({
    meta: [{ title: "Outreach Leaderboard" }],
  }),
});

function Component() {
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
    <>
      <DefaultAppBar title="Outreach Leaderboard" />
      <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
        <Stack gap={2} sx={{ height: "100%", display: "flex" }}>
          <Datatable
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
        </Stack>
      </Container>
    </>
  );
}
