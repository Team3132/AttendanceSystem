import PendingEventListItem from "@/components/AdminPendingEventListItem";
import { usersQueryOptions } from "@/queries/users.queries";
import { Container, Stack, Paper, Typography, List } from "@mui/material";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/admin_/users/$userId/pending",
)({
  component: Component,
  loader: async ({ context: { queryClient }, params: { userId } }) =>
    queryClient.prefetchQuery(usersQueryOptions.userPendingRsvps(userId)),
});

function Component() {
  const { userId } = Route.useParams();

  const pendingEventsQuery = useSuspenseQuery(
    usersQueryOptions.userPendingRsvps(userId),
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
                <PendingEventListItem
                  rsvp={rsvp}
                  userId={userId}
                  key={rsvp.id}
                />
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
