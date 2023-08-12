import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { z } from "zod";
import queryClient from "../../../queryClient";
import userApi from "../../../api/query/user.api";
import ensureAuth from "../../auth/utils/ensureAuth";
import { useQuery } from "@tanstack/react-query";
import authApi from "../../../api/query/auth.api";
import { Container, Stack, Paper, Typography, List } from "@mui/material";
import PendingEventListItem from "../../../components/PendingEventListItem";

const PendingEventsPageParamsSchema = z.object({
  userId: z.string().optional(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.userId !== undefined) {
    await ensureAuth(true);
  }

  const initialAuthStatus = await ensureAuth();

  const validatedParams = PendingEventsPageParamsSchema.parse(params);
  const userId = validatedParams.userId;
  const pendingEvents = await queryClient.ensureQueryData(
    userApi.getPendingRsvps(userId)
  );
  return {
    userId: validatedParams.userId,
    pendingEvents,
    initialAuthStatus,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const authStatusQuery = useQuery({
    ...authApi.getAuthStatus,
    initialData: loaderData.initialAuthStatus,
  });

  const pendingEventsQuery = useQuery({
    ...userApi.getPendingRsvps(loaderData.userId),
    initialData: loaderData.pendingEvents,
  });

  return (
    <Container
      sx={{
        overflow: "auto",
      }}
    >
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
