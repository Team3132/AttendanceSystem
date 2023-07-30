import { LeaderboardDto } from "@/generated";
import { createColumnHelper } from "@tanstack/react-table";
import useLeaderboard from "../hooks/useLeaderboard";
import { DataTable } from "@/components/DataTable";
import { Heading, Stack } from "@chakra-ui/react";

const columnHelper = createColumnHelper<LeaderboardDto>();

const columns = [
  columnHelper.accessor("rank", {
    header: "Rank",
  }),
  columnHelper.accessor("outreachHours", {
    header: "Outreach hour count",
  }),
  columnHelper.accessor("username", {
    header: "Username",
  }),
];

export default function LeaderBoardDataTable() {
  const leaderboardQuery = useLeaderboard();

  return (
    <Stack py={2}>
      <Heading>Outreach Leaderboard</Heading>
      <DataTable columns={columns} data={leaderboardQuery.data ?? []} />
    </Stack>
  );
}
