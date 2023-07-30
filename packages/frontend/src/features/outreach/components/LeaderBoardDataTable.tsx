import { LeaderboardDto } from "@/generated";
import { createColumnHelper } from "@tanstack/react-table";
import useLeaderboard from "../hooks/useLeaderboard";
import { DataTable } from "@/components/DataTable";
import { Container, Heading, Stack } from "@chakra-ui/react";

const columnHelper = createColumnHelper<LeaderboardDto>();

const columns = [
  columnHelper.accessor("rank", {
    header: "Rank",
    cell: (props) => <b>{Number(props.getValue())}</b>,
  }),
  columnHelper.accessor("outreachHours", {
    header: "Outreach hour count",
    cell: (props) => Number(props.getValue()),
  }),
  columnHelper.accessor("username", {
    header: "Username",
  }),
];

export default function LeaderBoardDataTable() {
  const leaderboardQuery = useLeaderboard();

  return (
    <Container py={2} maxW={"container.sm"}>
      <Heading textAlign={"center"}>Outreach Leaderboard</Heading>
      <DataTable columns={columns} data={leaderboardQuery.data ?? []} />
    </Container>
  );
}
