import { useLoaderData } from "react-router-dom";
import ensureAuth from "../../auth/utils/ensureAuth";
import { Container, Stack, Paper, Typography, List } from "@mui/material";
import PendingEventListItem from "../../../components/PendingEventListItem";
import { queryUtils } from "@/trpcClient";
import { trpc } from "@/trpcClient";

export async function loader() {
  const initialAuthStatus = await ensureAuth();

  const pendingEvents = await queryUtils.users.getSelfPendingRsvps.ensureData();
  return {
    pendingEvents,
    initialAuthStatus,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const pendingEventsQuery = trpc.users.getSelfPendingRsvps.useQuery(
    undefined,
    {
      initialData: loaderData.pendingEvents,
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
