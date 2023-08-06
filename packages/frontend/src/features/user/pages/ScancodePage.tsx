import { z } from "zod";
import ensureAuth from "../../auth/utils/ensureAuth";
import userApi from "../../../api/query/user.api";
import queryClient from "../../../queryClient";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container, List, Paper, Stack, Typography } from "@mui/material";
import NewScancodeListItem from "../components/NewScancodeForm";
import ScancodeListItem from "../components/ScancodeListItem";

const UserParamsSchema = z.object({
  userId: z.string().optional(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const { userId } = UserParamsSchema.parse(params);

  if (userId) {
    await ensureAuth(true);
  }

  const initialUserData = await queryClient.ensureQueryData(
    userApi.getUser(userId),
  );

  const initialAuthStatus = await ensureAuth();

  const initialScancodes = await queryClient.ensureQueryData(
    userApi.getUserScancodes(userId),
  );

  return {
    userId,
    initialUserData,
    initialAuthStatus,
    initialScancodes,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const scancodesQuery = useQuery({
    ...userApi.getUserScancodes(loaderData.userId),
    initialData: loaderData.initialScancodes,
  });

  return (
    <Container>
      <Stack py={2} gap={2}>
        <Paper sx={{ p: 2 }}>
          <Stack gap={2}>
            <Typography variant="h4">Scancodes</Typography>
            <Typography variant="body1">
              Scancodes are used to check in to events. You can generate a new
              scancode at any time.
            </Typography>
            <List>
              <NewScancodeListItem userId={loaderData.userId} />
              {scancodesQuery.data.map((scancode) => (
                <ScancodeListItem scancode={scancode} key={scancode.code} />
              ))}
            </List>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
