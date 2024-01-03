import { Stack, Typography } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import Datatable from "../../../components/DataTable";
import { z } from "zod";
import { BuildPointUserSchema } from "backend/schema";
import { trpc } from "@/trpcClient";
import { useMemo } from "react";

type LeaderboardUser = z.infer<typeof BuildPointUserSchema>;

const columnHelper = createColumnHelper<LeaderboardUser>();

const columns = [
  columnHelper.accessor("rank", {
    header: "Rank",
    maxSize: 50,
  }),
  columnHelper.accessor("username", {
    header: "Username",
  }),
  columnHelper.accessor("points", {
    header: "Build Season Points",
  }),
];

export function Component() {
  const leaderboardQuery =
    trpc.outreach.buildPointsLeaderboard.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );

  const flatResults = useMemo(
    () => leaderboardQuery.data?.pages.flatMap((page) => page.items),
    [leaderboardQuery.data]
  );

  const totalRowCount = useMemo(
    () => leaderboardQuery.data?.pages.at(-1)?.total ?? 0,
    [leaderboardQuery.data]
  );

  if (leaderboardQuery.data) {
    return (
      <Stack gap={2} sx={{ height: "100%", display: "flex" }}>
        <Typography variant="h4">Leaderboard</Typography>
        <Datatable
          columns={columns ?? []}
          data={flatResults ?? []}
          totalDBRowCount={totalRowCount}
          fetchNextPage={leaderboardQuery.fetchNextPage}
          isFetching={leaderboardQuery.isFetching}
          sx={{
            flex: 1,
          }}
          fixedHeight={53}
        />
      </Stack>
    );
  }

  return <Typography variant="h4">Loading...</Typography>;
}
