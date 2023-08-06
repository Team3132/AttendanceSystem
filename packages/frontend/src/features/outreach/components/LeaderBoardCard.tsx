import { useQuery } from "@tanstack/react-query";
import outreachApi from "../../../api/query/outreach.api";
import { Paper, Stack, Typography } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { LeaderboardDto } from "../../../api/generated";
import ErrorCard from "../../../components/ErrorCard";
import Datatable from "../../../components/DataTable";

const columnHelper = createColumnHelper<LeaderboardDto>();

const columns = [
  columnHelper.accessor("rank", {
    header: "Rank",
    maxSize: 50,
  }),
  columnHelper.accessor("username", {
    header: "Username",
  }),
  columnHelper.accessor("outreachHours", {
    header: "Outreach Hours",
  }),
];
export default function LeaderboardCard() {
  const leaderboardQuery = useQuery(outreachApi.getLeaderboard);

  if (leaderboardQuery.data) {
    return (
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Stack gap={2}>
          <Typography variant="h4">Leaderboard</Typography>
          <Datatable columns={columns} data={leaderboardQuery.data} />
        </Stack>
      </Paper>
    );
  }

  if (leaderboardQuery.isError) {
    return <ErrorCard error={leaderboardQuery.error} />;
  }

  return (
    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h4">Loading...</Typography>
    </Paper>
  );
}
