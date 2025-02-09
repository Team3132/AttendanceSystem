import BottomBar from "@/components/BottomBar";
import DefaultAppBar from "@/components/DefaultAppBar";
import { authQueryOptions } from "@/queries/auth.queries";
import { Box, Container } from "@mui/material";
import {
  Outlet,
  createFileRoute,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const { isAuthenticated } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(authQueryOptions.status());
  },
  component: Component,
});

function Component() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <TitledAppBar />
      <Container
        sx={{
          my: 2,
          flex: 1,
          overflowY: "auto",
          gap: 2,
          display: "flex",
          flexDir: "column",
        }}
      >
        <Outlet />
      </Container>
      <BottomBar />
    </Box>
  );
}

function TitledAppBar() {
  const matches = useRouterState({ select: (s) => s.matches });

  const title = useMemo(() => {
    const matchWithTitle = [...matches]
      .reverse()
      .find((d) => d.context.getTitle);

    if (matchWithTitle?.context.getTitle) {
      return matchWithTitle.context.getTitle();
    }

    return "Attendance System";
  }, [matches]);

  return <DefaultAppBar title={title} />;
}
