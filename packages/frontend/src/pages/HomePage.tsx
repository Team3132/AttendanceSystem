import { Container, Paper, Stack, Typography } from "@mui/material";
import { RouteApi } from "@tanstack/react-router";
import ActiveEventsList from "../components/ActiveEventsList";
import DefaultAppBar from "../components/DefaultAppBar";

const appVersion = import.meta.env.VITE_APP_VERSION as string | undefined;

const routeApi = new RouteApi({
  id: "/authedOnly/",
});

export function Component() {
  const loaderData = routeApi.useLoaderData();

  return (
    <>
      <DefaultAppBar title="Home" />
      <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
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
              <ActiveEventsList initialPendingEvents={loaderData} />
            </Stack>
          </Paper>
          {appVersion ? (
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Stack gap={2}>
                <Typography variant="h4">Version</Typography>
                <Typography variant="body1">{appVersion}</Typography>
              </Stack>
            </Paper>
          ) : null}
        </Stack>
      </Container>
    </>
  );
}
