import ScancodeListItem from "@/features/user/components/AdminScancodeListItem";
import NewAdminScancodeListItem from "@/features/user/components/NewAdminScancodeForm";
import { usersQueryOptions } from "@/queries/users.queries";
import { createFileRoute } from "@tanstack/react-router";

import { Container, List, Paper, Stack, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/admin_/users/$userId/")({
  component: Component,
  loader: ({ context: { queryClient }, params: { userId } }) => {
    queryClient.prefetchQuery(usersQueryOptions.userScancodes(userId));
    return queryClient.ensureQueryData(usersQueryOptions.userDetails(userId));
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.username}'s Scancodes`,
      },
    ],
  }),
});

function Component() {
  const { userId } = Route.useParams();

  const scancodesQuery = useSuspenseQuery(
    usersQueryOptions.userScancodes(userId),
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
              <NewAdminScancodeListItem userId={userId} />
              {scancodesQuery.data.map((scancode) => (
                <ScancodeListItem
                  scancode={scancode.code}
                  key={scancode.code}
                  userId={userId}
                />
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
