import { Container, Paper, Stack, Typography } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import ensureAuth from "../../auth/utils/ensureAuth";
import UserList from "../components/UserList";
import { queryUtils } from "@/trpcClient";
import { useLoaderData } from "react-router-dom";

export async function loader() {
  const initialAuthData = await ensureAuth(true);
  const initialUserList = await queryUtils.users.getUserList.ensureData();
  return {
    initialAuthData,
    initialUserList,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <>
      <DefaultAppBar title="Admin" />
      <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
        <Stack gap={2} py={2}>
          <Paper sx={{ p: 2 }}>
            <Stack gap={2}>
              <Typography variant="h5">Users</Typography>
              <UserList initialUserList={loaderData.initialUserList} />
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
