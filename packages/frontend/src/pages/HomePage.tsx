import { Container, Paper, Stack, Typography } from "@mui/material";
import ensureAuth from "../features/auth/utils/ensureAuth";
import DefaultAppBar from "../components/DefaultAppBar";
import queryClient from "../queryClient";
import userApi from "../api/query/user.api";
import ActiveEventsList from "../components/ActiveEventsList";
import { useLoaderData } from "react-router-dom";

export async function loader() {
  await ensureAuth();

  const initialActiveEvents = await queryClient.ensureQueryData(
    userApi.getPendingRsvps(),
  );

  return {
    initialActiveEvents,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <>
      <DefaultAppBar title="Home" />
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
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Stack gap={2}>
              <Typography variant="h4">Active Events</Typography>
              <ActiveEventsList
                initialPendingEvents={loaderData.initialActiveEvents}
              />
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
