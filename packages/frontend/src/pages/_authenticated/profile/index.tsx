import PendingEventListItem from "@/components/PendingEventListItem";
import NewScancodeListItem from "@/features/user/components/NewScancodeForm";
import ScancodeListItem from "@/features/user/components/ScancodeListItem";
import { trpc } from "@/trpcClient";
import { Container, Stack, Paper, Typography, List } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile/")({
  loader: async ({ context: { queryUtils } }) =>
    queryUtils.users.getSelfScancodes.ensureData(),
  component: Component,
});

function Component() {
  const loaderData = Route.useLoaderData();

  const scancodesQuery = trpc.users.getSelfScancodes.useQuery(undefined, {
    initialData: loaderData,
  });

  return (
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
      <Stack py={2} gap={2}>
        <Paper sx={{ p: 2 }}>
          <Stack gap={2}>
            <Typography variant="h4">Scancodes</Typography>
            <Typography variant="body1">
              Scancodes are used to check in to events. You can generate a new
              scancode at any time.
            </Typography>
            <List>
              <NewScancodeListItem />
              {scancodesQuery.data.map((scancode) => (
                <ScancodeListItem code={scancode.code} key={scancode.code} />
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
