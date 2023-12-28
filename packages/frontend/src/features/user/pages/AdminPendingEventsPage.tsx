import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { z } from "zod";
import ensureAuth from "../../auth/utils/ensureAuth";
import { Container, Stack, Paper, Typography, List } from "@mui/material";
import PendingEventListItem from "../../../components/AdminPendingEventListItem";
import { trpc } from "@/trpcClient";
import { queryUtils } from "@/trpcClient";

const PendingEventsPageParamsSchema = z.object({
  userId: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const initialAuthStatus = await ensureAuth(true);

  const validatedParams = PendingEventsPageParamsSchema.parse(params);
  const userId = validatedParams.userId;
  const pendingEvents =
    await queryUtils.users.getUserPendingRsvps.ensureData(userId);
  return {
    userId: validatedParams.userId,
    pendingEvents,
    initialAuthStatus,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const pendingEventsQuery = trpc.users.getUserPendingRsvps.useQuery(
    loaderData.userId,
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
                <PendingEventListItem rsvp={rsvp} userId={loaderData.userId} />
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
