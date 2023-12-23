import { z } from "zod";
import ensureAuth from "../../auth/utils/ensureAuth";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { Container, List, Paper, Stack, Typography } from "@mui/material";
import ScancodeListItem from "../components/AdminScancodeListItem";
import { queryUtils } from "@/trpcClient";
import { trpc } from "@/trpcClient";
import NewAdminScancodeListItem from "../components/NewAdminScancodeForm";

const UserParamsSchema = z.object({
  userId: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const { userId } = UserParamsSchema.parse(params);

  const initialAuthStatus = await ensureAuth(true);

  const initialUserData = await queryUtils.users.getUser.ensureData(userId);

  const initialScancodes =
    await queryUtils.users.getUserScancodes.ensureData(userId);

  return {
    userId,
    initialUserData,
    initialAuthStatus,
    initialScancodes,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const scancodesQuery = trpc.users.getUserScancodes.useQuery(
    loaderData.userId,
    {
      initialData: loaderData.initialScancodes,
    }
  );

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
