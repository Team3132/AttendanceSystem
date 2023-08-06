import { Container, Stack } from "@mui/material";
import DefaultAppBar from "../../../components/DefaultAppBar";
import ensureAuth from "../../auth/utils/ensureAuth";

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
          Nothing here yet, check back later
        </Stack>
      </Container>
    </>
  );
}
