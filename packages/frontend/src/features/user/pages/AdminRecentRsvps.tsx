import { trpc } from "@/trpcClient";
import {
  Container,
  Stack,
  Paper,
  Typography,
  List,
  ListItemProps,
  ListItem,
} from "@mui/material";
import { RouteApi } from "@tanstack/react-router";
import { UserRecentRsvpSchema } from "backend/schema/PagedUserRecentRsvpsSchema";
import { ForwardedRef, forwardRef } from "react";
import { z } from "zod";

const routeApi = new RouteApi({
  id: "/authedOnly/adminOnly/user/$userId/recent-rsvps",
});

export default function AdminRecentRsvps() {
  const loaderData = routeApi.useLoaderData();

  const recentRsvpsQuery = trpc.users.getUserRecentRsvps.useInfiniteQuery(
    {
      userId: loaderData.userId,
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  return (
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
      <Stack py={2} gap={2}>
        <Paper sx={{ p: 2 }}>
          <Stack gap={2}>
            <Typography variant="h4">Recent RSVPs</Typography>
            <Typography variant="body1">
              Any events that this user has RSVP'd to will show up here.
            </Typography>
            <List></List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
