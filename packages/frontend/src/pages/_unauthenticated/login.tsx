import { queryUtils, trpc } from "@/trpcClient";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const isTauri = !!(
  window as unknown as Window & {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    __TAURI_INTERNALS__: any;
  }
).__TAURI_INTERNALS__;

const openTauriWindow = async (url: string) => {
  const { open } = await import("@tauri-apps/plugin-shell");
  open(url);
};

const buttonProps = isTauri
  ? {
      onClick: async () => {
        await openTauriWindow(
          `${import.meta.env.VITE_BACKEND_URL}/auth/discord-desktop`,
        );
      },
    }
  : {
      href: "/api/auth/discord",
    };

function CredListener() {
  useEffect(() => {
    const bootstrap = async () => {
      if (isTauri) {
        const { listen } = await import("@tauri-apps/api/event");

        const unlisten = await listen("session", (session) => {
          queryUtils.invalidate();
        });

        return () => {
          unlisten();
        };
      }
    };
    bootstrap();
  }, []);

  return null;
}

export const Route = createFileRoute("/_unauthenticated/login")({
  component: () => (
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
      <CredListener />
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
          <Button variant="contained" color="primary" {...buttonProps}>
            Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  ),
});
