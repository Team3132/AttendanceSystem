import BottomBar from "@/components/BottomBar";
import TopBar from "@/components/TopBar";
import { authQueryOptions } from "@/queries/auth.queries";
import { Box, Container, styled } from "@mui/material";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

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

const RootWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const RootContainer = styled(Container)({
  my: 2,
  flex: 1,
  overflowY: "auto",
});

function Component() {
  return (
    <RootWrapper>
      <TopBar />
      <RootContainer id="main-area">
        <Outlet />
      </RootContainer>
      <BottomBar />
    </RootWrapper>
  );
}
