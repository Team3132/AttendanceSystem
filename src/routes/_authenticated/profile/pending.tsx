import PendingEventListItem from "@/components/PendingEventListItem";
import { usersQueryOptions } from "@/queries/users.queries";

import { Container, List, Paper, Stack, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import {} from "@tanstack/react-router";

export const Route = createFileRoute({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(usersQueryOptions.userSelfPendingRsvps());
  },
  head: () => ({
    meta: [
      {
        title: "Profile - Pending Events",
      },
    ],
  }),
  component: Component,
});

function Component() {
  const pendingEventsQuery = useSuspenseQuery(
    usersQueryOptions.userSelfPendingRsvps(),
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
