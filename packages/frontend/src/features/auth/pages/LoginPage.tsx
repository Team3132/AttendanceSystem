import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { trpc } from "@/trpcClient";
import { RouteApi } from "@tanstack/react-router";

const routeApi = new RouteApi({ id: "/unauthedOnly/login" });

export function Component() {
  const initialAuthStatus = routeApi.useLoaderData();
  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
    initialData: initialAuthStatus,
  });

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          justifySelf: "center",
        }}
      >
        <Stack gap={2}>
          <Typography variant="h4" textAlign={"center"}>
            Login
          </Typography>
          <Typography variant="body1" textAlign={"center"}>
            In order to use the attendance system, you must login with the same
            discord account that you use for the team Discord server.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/api/auth/discord"
            disabled={authStatusQuery.data.isAuthenticated}
          >
            Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
