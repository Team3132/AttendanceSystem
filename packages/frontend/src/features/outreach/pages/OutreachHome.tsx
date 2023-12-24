import { Container, Stack } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import LeaderboardCard from "../components/LeaderBoardCard";
import ensureAuth from "@/features/auth/utils/ensureAuth";
import { queryUtils } from "@/trpcClient";
import { useLoaderData } from "react-router-dom";

export async function loader() {
  const initialAuth = await ensureAuth();

  const initialLeaderboard = await queryUtils.outreach.leaderboard.ensureData();

  return {
    initialLeaderboard,
    initialAuth,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <>
      <DefaultAppBar title="Outreach" />
      <Container
        sx={{
          my: 2,
          overflow: "auto",
        }}
      >
        <Stack gap={2}>
          <LeaderboardCard initialLeaderboard={loaderData.initialLeaderboard} />
        </Stack>
      </Container>
    </>
  );
}
