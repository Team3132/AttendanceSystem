import PendingEventListItem from "@/components/PendingEventListItem";
import { trpc } from "@/trpcClient";
import { Container, Stack, Paper, Typography, List } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile/pending")({
  component: Component,
  loader: ({ context: { queryUtils } }) =>
    queryUtils.users.getSelfPendingRsvps.ensureData(),
});

function Component() {
  const loaderData = Route.useLoaderData();

  const pendingEventsQuery = trpc.users.getSelfPendingRsvps.useQuery(
    undefined,
    {
      initialData: loaderData,
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
                <PendingEventListItem rsvp={rsvp} key={rsvp.id} />
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
