import { trpc } from "@/trpcClient";
import { Container, List, Paper, Stack, Typography } from "@mui/material";
import { RouteApi } from "@tanstack/react-router";
import NewScancodeListItem from "../components/NewScancodeForm";
import ScancodeListItem from "../components/ScancodeListItem";

const routeApi = new RouteApi({ id: "/authedOnly/profile/" });

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const scancodesQuery = trpc.users.getSelfScancodes.useQuery(undefined, {
    initialData: loaderData.initialScancodes,
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
