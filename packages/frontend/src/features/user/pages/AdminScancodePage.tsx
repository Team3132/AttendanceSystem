import { trpc } from "@/trpcClient";
import { Container, List, Paper, Stack, Typography } from "@mui/material";
import { RouteApi } from "@tanstack/react-router";
import ScancodeListItem from "../components/AdminScancodeListItem";
import NewAdminScancodeListItem from "../components/NewAdminScancodeForm";

const routeApi = new RouteApi({ id: "/authedOnly/adminOnly/user/$userId/" });

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const scancodesQuery = trpc.users.getUserScancodes.useQuery(
    loaderData.userId,
    {
      initialData: loaderData.initialScancodes,
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
