import { toaster } from "@/components/Toaster";
import useLogout from "@/hooks/useLogout";
import { authQueryOptions } from "@/queries/auth.queries";
import { generateRedirect } from "@/server/auth/generateRedirect";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { Suspense } from "react";

export const Route = createFileRoute("/login")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(authQueryOptions.status());
  },
  component: Component,
});

function Component() {
  const loginFn = useServerFn(generateRedirect);

  const handleLogin = async () => {
    try {
      console.log("handle login called");

      const { url } = await loginFn({
        data: {
          // @ts-ignore
          isMobile: !!window.__TAURI__,
        },
      });

      // @ts-ignore
      if (window.__TAURI__) {
        const { openUrl } = await import("@tauri-apps/plugin-opener");
        return openUrl(url);
      }
    } catch (error) {
      if (error instanceof Error)
        toaster.error({
          description: error.toString(),
        });
    }
  };

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
          <Stack gap={2} direction="row" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login
            </Button>
            <Suspense fallback={null}>
              <LogoutButton />
            </Suspense>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

function LogoutButton() {
  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

  const logoutMutation = useLogout();

  if (authStatusQuery.data.isAuthenticated) {
    return (
      <Button
        variant="contained"
        color="secondary"
        onClick={() =>
          logoutMutation.mutate({
            data: undefined,
          })
        }
        loading={logoutMutation.isPending}
      >
        Logout
      </Button>
    );
  }

  return <></>;
}
