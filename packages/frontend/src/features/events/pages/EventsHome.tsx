import { Container, Paper, Stack, Typography } from "@mui/material";
import ensureAuth from "../../../features/auth/utils/ensureAuth";
import DefaultAppBar from "../../../components/DefaultAppBar";
import UpcomingEventsCard from "../components/UpcomingEventsCard";

export async function loader() {
  await ensureAuth();
  return null;
}

export function Component() {
  return (
    <>
      <DefaultAppBar title="Events" />
      <Container
        sx={{
          my: 2,
        }}
      >
        <Stack gap={2}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Stack gap={2}>
              <Typography variant="h4">
                Welcome to the Attendance System
              </Typography>
              <Typography variant="body1">
                This is the attendance system for the FRC team 3132 Thunder Down
                Under. This system is used to track attendance for team members
                at events and outreach activities.
              </Typography>
            </Stack>
          </Paper>
          <UpcomingEventsCard />
        </Stack>
      </Container>
    </>
  );
}
