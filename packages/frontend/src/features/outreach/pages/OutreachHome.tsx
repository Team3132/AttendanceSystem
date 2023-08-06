import { Container, Stack } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import LeaderboardCard from "../components/LeaderBoardCard";

export function Component() {
  return (
    <>
      <DefaultAppBar title="Outreach" />
      <Container
        sx={{
          my: 2,
        }}
      >
        <Stack gap={2}>
          <LeaderboardCard />
        </Stack>
      </Container>
    </>
  );
}
