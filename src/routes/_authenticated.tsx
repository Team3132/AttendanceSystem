import BottomBar from "@/components/BottomBar";
import GenericServerErrorBoundary from "@/components/GenericServerErrorBoundary";
import TopBar from "@/components/TopBar";
import { authQueryOptions } from "@/queries/auth.queries";
import { consola } from "@/server/logger";
import { Box, Container, LinearProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet, redirect, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute({
  beforeLoad: async ({ context: { queryClient } }) => {
    const { isAuthenticated } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );
    if (!isAuthenticated) {
      consola.warn("User is not authenticated, redirecting to login page.");
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

const RootWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const RootContainer = styled(Container)({
  flex: 1,
  overflowY: "auto",
});

function NavigationProgress() {
  const navigationStatus = useRouterState({
    select: (s) => s.status,
  });

  return (
    <LinearProgress
      sx={{ position: "fixed", top: 0, left: 0, right: 0 }}
      hidden={navigationStatus === "idle"}
    />
  );
}

function Component() {
  return (
    <RootWrapper>
      <NavigationProgress />
      <TopBar />
      <RootContainer id="main-area">
        {/* Catch any errors in authenticated routes */}
        <GenericServerErrorBoundary>
          <Outlet />
        </GenericServerErrorBoundary>
      </RootContainer>
      <BottomBar />
    </RootWrapper>
  );
}
