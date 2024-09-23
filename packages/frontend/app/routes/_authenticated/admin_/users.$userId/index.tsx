import ScancodeListItem from "@/features/user/components/AdminScancodeListItem";
import NewAdminScancodeListItem from "@/features/user/components/NewAdminScancodeForm";
import { queryUtils, trpc } from "@/trpcClient";
import { Container, Stack, Paper, Typography, List } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/users/$userId/")({
  component: Component,
  loader: async ({ context: { queryUtils }, params: { userId } }) => {
    const scancodes =
      await queryUtils.users.getUserScancodes.ensureData(userId);
    return {
      userId,
      scancodes,
    };
  },
});

function Component() {
  const loaderData = Route.useLoaderData();

  const scancodesQuery = trpc.users.getUserScancodes.useQuery(
    loaderData.userId,
    {
      initialData: loaderData.scancodes,
    },
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
              <NewAdminScancodeListItem userId={loaderData.userId} />
              {scancodesQuery.data.map((scancode) => (
                <ScancodeListItem
                  scancode={scancode.code}
                  key={scancode.code}
                  userId={loaderData.userId}
                />
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
