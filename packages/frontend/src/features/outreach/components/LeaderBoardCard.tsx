import { Paper, Stack, Typography } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import Datatable from "../../../components/DataTable";
import { z } from "zod";
import { LeaderBoardUser as LeaderboardUserSchema } from "backend/schema";
import { trpc } from "@/trpcClient";
import { Duration } from "luxon";

type LeaderboardUser = z.infer<typeof LeaderboardUserSchema>;

const columnHelper = createColumnHelper<LeaderboardUser>();

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
      return Duration.fromISO(props.getValue()).toHuman();
    },
  }),
];

interface LeaderboardCardProps {
  initialLeaderboard: Array<LeaderboardUser>;
}

export default function LeaderboardCard(props: LeaderboardCardProps) {
  const leaderboardQuery = trpc.outreach.leaderboard.useQuery(undefined, {
    initialData: props.initialLeaderboard,
  });

  if (leaderboardQuery.data) {
    return (
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Stack gap={2}>
          <Typography variant="h4">Leaderboard</Typography>
          <Datatable columns={columns ?? []} data={leaderboardQuery.data} />
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h4">Loading...</Typography>
    </Paper>
  );
}
