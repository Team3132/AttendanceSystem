import { toaster } from "@/components/Toaster";
import useLogout from "@/hooks/useLogout";
import { authQueryOptions } from "@/queries/auth.queries";
import env from "@/server/env";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { Suspense } from "react";

export const Route = createFileRoute("/login")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(authQueryOptions.status());
  },
  component: Component,
});

function Component() {
  const handleLogin = async () => {
    try {
      console.log("handle login called");

      toaster.info({ description: "test" });

      // @ts-ignore
      if (window?.__TAURI__) {
        const { openUrl } = await import("@tauri-apps/plugin-opener");
        const { onOpenUrl } = await import("@tauri-apps/plugin-deep-link");
        await openUrl(
          `${env.VITE_FRONTEND_URL}/api/auth/discord?isMobile=true`,
        );

        await onOpenUrl(async (urls) => {
          for (const url of urls) {
            const deepLinkURL = new URL(url);

            console.log({
              protocol: deepLinkURL.protocol,
              host: deepLinkURL.host,
            });

            if (
              deepLinkURL.protocol === "attendance:" &&
              deepLinkURL.host === "login"
            ) {
              const { Store } = await import("@tauri-apps/plugin-store");
              const store = await Store.load("store.json");

              const sessionId = deepLinkURL.searchParams.get("sessionId");

              await store.set("sessionId", sessionId);

              await store.save();

              window.location.href = "/";
            }
          }
        });
      }

      throw redirect({
        to: "/api/auth/discord",
      });
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
