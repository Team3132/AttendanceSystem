import { trpc } from "@/trpcClient";
import { Container, List, Paper, Stack, Typography } from "@mui/material";
import { RouteApi } from "@tanstack/react-router";
import PendingEventListItem from "../../../components/AdminPendingEventListItem";

const routeApi = new RouteApi({
  id: "/authedOnly/adminOnly/user/$userId/pending",
});

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const pendingEventsQuery = trpc.users.getUserPendingRsvps.useQuery(
    loaderData.userId,
    {
      initialData: loaderData.initialPendingEvents,
    },
  );

  return (
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
      <Stack py={2} gap={2}>
        <Paper sx={{ p: 2 }}>
          <Stack gap={2}>
            <Typography variant="h4">Active Events</Typography>
            <Typography variant="body1">
              Events that you checked into but have not yet checked out of.
            </Typography>
            <List>
              {pendingEventsQuery.data.map((rsvp) => (
                <PendingEventListItem rsvp={rsvp} userId={loaderData.userId} />
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
