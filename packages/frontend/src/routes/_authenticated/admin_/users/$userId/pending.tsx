import PendingEventListItem from "@/components/AdminPendingEventListItem";
import { usersQueryOptions } from "@/queries/users.queries";
import { Container, List, Paper, Stack, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import {} from "@tanstack/react-router";

export const Route = createFileRoute({
  component: Component,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    queryClient.prefetchQuery(usersQueryOptions.userPendingRsvps(userId));
    return queryClient.ensureQueryData(usersQueryOptions.userDetails(userId));
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.username}'s Pending Events`,
      },
    ],
  }),
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
