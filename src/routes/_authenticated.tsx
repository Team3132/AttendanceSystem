import BottomBar from "@/components/BottomBar";
import GenericServerErrorBoundary from "@/components/GenericServerErrorBoundary";
import TopBar from "@/components/TopBar";
import { authQueryOptions } from "@/queries/auth.queries";
import { consola } from "@/server/logger";
import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
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

function Component() {
  return (
    <RootWrapper>
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
