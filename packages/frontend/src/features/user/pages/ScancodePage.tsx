import ensureAuth from "../../auth/utils/ensureAuth";
import { useLoaderData } from "react-router-dom";
import { Container, List, Paper, Stack, Typography } from "@mui/material";
import NewScancodeListItem from "../components/NewScancodeForm";
import ScancodeListItem from "../components/ScancodeListItem";
import { queryUtils } from "@/trpcClient";
import { trpc } from "@/trpcClient";

export async function loader() {
  await ensureAuth();

  const initialUserData = await queryUtils.users.getSelf.ensureData();

  const initialAuthStatus = await ensureAuth();

  const initialScancodes = await queryUtils.users.getSelfScancodes.ensureData();

  return {
    initialUserData,
    initialAuthStatus,
    initialScancodes,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const scancodesQuery = trpc.users.getSelfScancodes.useQuery(undefined, {
    initialData: loaderData.initialScancodes,
  });

  return (
    <Container
      sx={{
        overflow: "auto",
      }}
    >
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
