import { usersQueryOptions } from "@/queries/users.queries";
import { EventTypeSchema } from "@/server";
import { List, ListItem, Paper, Stack, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const TypesSchema = z.record(z.boolean(), EventTypeSchema);

const QuerySchema = z.object({
  types: fallback(TypesSchema.optional(), undefined),
  startDate: fallback(z.string().datetime().optional(), undefined),
  endDate: fallback(z.string().datetime().optional(), undefined),
});

export const Route = createFileRoute(
  "/_authenticated/admin_/users/$userId/summary",
)({
  validateSearch: QuerySchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(usersQueryOptions.userDetails(userId));
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.username}'s Summary`,
      },
    ],
  }),
  component: RouteComponent,
});

/**
 * Stats
 * * Percentage of events attended, multiselect of categories
 * * Total hours attended (also by category)
 * * Percentage of total event time attended (by hour)
 */

function RouteComponent() {
  return (
    <Stack py={2} gap={2}>
      <Typography variant="h4">Summary</Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5">Stats</Typography>
        <List>
          <ListItem>Percentage of events attended</ListItem>
          <ListItem>Total hours attended</ListItem>
          <ListItem>Percentage of total event time attended</ListItem>
        </List>
      </Paper>
    </Stack>
  );
}
