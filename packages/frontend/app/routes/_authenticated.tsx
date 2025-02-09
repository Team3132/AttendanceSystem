import BottomBar from "@/components/BottomBar";
import DefaultAppBar from "@/components/DefaultAppBar";
import { authQueryOptions } from "@/queries/auth.queries";
import { Box, Container } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Outlet,
  createFileRoute,
  redirect,
  useRouterState,
} from "@tanstack/react-router";

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

  const getTitleQuery = useQuery({
    queryKey: ["getTitle", matches],
    queryFn: async () => {
      const matchWithTitle = [...matches]
        .reverse()
        .find((d) => d.context.getTitle);

      return matchWithTitle?.context.getTitle
        ? await matchWithTitle?.context.getTitle()
        : "My App";
    },
    placeholderData: keepPreviousData,
  });

  return <DefaultAppBar title={getTitleQuery.data ?? "My App"} />;
}
