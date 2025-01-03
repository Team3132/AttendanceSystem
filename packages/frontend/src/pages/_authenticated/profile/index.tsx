import PendingEventListItem from "@/components/PendingEventListItem";
import NewScancodeListItem from "@/features/user/components/NewScancodeForm";
import ScancodeListItem from "@/features/user/components/ScancodeListItem";
import { usersQueryOptions } from "@/queries/users.queries";

import { Container, Stack, Paper, Typography, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile/")({
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(usersQueryOptions.userSelfScancodes()),
  component: Component,
});

function Component() {
  const loaderData = Route.useLoaderData();

  const scancodesQuery = useQuery({
    ...usersQueryOptions.userSelfScancodes(),
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
