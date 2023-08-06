import { Container, Paper, Stack, Typography } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import ensureAuth from "../../auth/utils/ensureAuth";
import UserList from "../components/UserList";

export async function loader() {
  const initialAuthData = await ensureAuth(true);
  return {
    initialAuthData,
  };
}

export function Component() {
  return (
    <>
      <DefaultAppBar title="Admin" />
      <Container sx={{ overflow: "auto" }}>
        <Stack gap={2} py={2}>
          <Paper sx={{ p: 2 }}>
            <Stack gap={2}>
              <Typography variant="h5">Users</Typography>
              <UserList />
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
