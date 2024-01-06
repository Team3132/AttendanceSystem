import Datatable from "@/components/DataTable";
import ensureAuth from "@/features/auth/utils/ensureAuth";
import { trpc } from "@/trpcClient";
import { Container, Stack, Paper, Typography } from "@mui/material";
import { createColumnHelper } from "@tanstack/table-core";
import { BuildPointSchema } from "backend/schema";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { z } from "zod";

export async function loader() {
  const initialAuthStatus = await ensureAuth();

  return {
    // pendingEvents,
    initialAuthStatus,
  };
}

const columnHelper = createColumnHelper<z.infer<typeof BuildPointSchema>>();

const columns = [
  columnHelper.accessor("points", {
    header: "Points",
  }),
  columnHelper.accessor("reason", {
    header: "Reason",
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (row) =>
      DateTime.fromISO(row.getValue()).toLocaleString(
        DateTime.DATE_MED_WITH_WEEKDAY
      ),
  }),
];

export function Component() {
  const buildPointsQuery = trpc.users.getSelfBuildPoints.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const flatResults = useMemo(
    () => buildPointsQuery.data?.pages.flatMap((page) => page.items),
    [buildPointsQuery.data]
  );

  const totalRowCount = useMemo(
    () => buildPointsQuery.data?.pages.at(-1)?.total ?? 0,
    [buildPointsQuery.data]
  );

  return (
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
      <Stack
        py={2}
        gap={2}
        sx={{
          height: "100%",
        }}
      >
        <Paper sx={{ p: 2, height: "100%" }}>
          <Stack
            gap={2}
            sx={{
              height: "100%",
            }}
          >
            <Typography variant="h4">Build Season Points</Typography>
            <Typography variant="body1">
              Points awarded by a mentor for a student's work during build
              season.
            </Typography>
            <Datatable
              data={flatResults ?? []}
              totalDBRowCount={totalRowCount}
              fetchNextPage={buildPointsQuery.fetchNextPage}
              isFetching={buildPointsQuery.isFetching}
              columns={columns}
              sx={{
                flex: 1,
              }}
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
