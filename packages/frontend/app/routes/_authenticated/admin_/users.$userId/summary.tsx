import { EventTypeSchema } from "@/server";
import {
  Container,
  Stack,
  Paper,
  Typography,
  List,
  ListItem,
} from "@mui/material";
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
  loader: async ({ context: { queryClient }, deps: search }) => {
    const { types, startDate, endDate } = search;
  },
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
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
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
    </Container>
  );
}
