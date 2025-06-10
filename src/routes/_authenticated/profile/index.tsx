import NewScancodeListItem from "@/features/user/components/NewScancodeForm";
import ScancodeListItem from "@/features/user/components/ScancodeListItem";
import { usersQueryOptions } from "@/queries/users.queries";
import { createFileRoute } from "@tanstack/react-router";

import { Container, List, Paper, Stack, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/profile/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(usersQueryOptions.userSelfScancodes());
  },
  head: () => ({
    meta: [
      {
        title: "Profile",
      },
    ],
  }),
  component: Component,
});

function Component() {
  const scancodesQuery = useSuspenseQuery(
    usersQueryOptions.userSelfScancodes(),
  );

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
