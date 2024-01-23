import { Container, Stack, Paper, Typography, List } from "@mui/material";
import PendingEventListItem from "../../../components/PendingEventListItem";
import { trpc } from "@/trpcClient";
import { RouteApi } from "@tanstack/react-router";

const routeApi = new RouteApi({ id: "/authedOnly/profile/pending" });

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const pendingEventsQuery = trpc.users.getSelfPendingRsvps.useQuery(
    undefined,
    {
      initialData: loaderData.initialPendingEvents,
    }
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
                <PendingEventListItem rsvp={rsvp} />
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
