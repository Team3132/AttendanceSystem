import { usersQueryOptions } from "@/queries/users.queries";
import env from "@/server/env";
import { Paper, Stack, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import ActiveEventsList from "../../components/ActiveEventsList";

const appVersion = env.VITE_PUBLIC_APP_VERSION;

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: () => ({
    getTitle: () => "Home",
  }),
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(usersQueryOptions.userSelfPendingRsvps());
  },
  component: Component,
});

function Component() {
  return (
    <Stack gap={2}>
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Stack gap={2}>
          <Typography variant="h4">Welcome to the Attendance System</Typography>
          <Typography variant="body1">
            This is the attendance system for the FRC team 3132 Thunder Down
            Under. This system is used to track attendance for team members at
            events and outreach activities.
          </Typography>
        </Stack>
      </Paper>
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Stack gap={2}>
          <Typography variant="h4">Active Events</Typography>
          <ActiveEventsList />
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
  );
}
