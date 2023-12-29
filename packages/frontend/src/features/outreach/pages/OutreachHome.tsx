import { Container } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import LeaderboardCard from "../components/LeaderBoardCard";
import ensureAuth from "@/features/auth/utils/ensureAuth";
import { queryUtils } from "@/trpcClient";

export async function loader() {
  const initialAuth = await ensureAuth();

  await queryUtils.outreach.leaderboard.prefetchInfinite({
    limit: 10,
  });

  return {
    initialAuth,
  };
}

export function Component() {
  return (
    <>
      <DefaultAppBar title="Outreach" />
      <Container sx={{ my: 2, flex: 1, overflowY: "auto", display: "flex" }}>
        <LeaderboardCard />
      </Container>
    </>
  );
}
