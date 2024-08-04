import DefaultAppBar from "@/components/DefaultAppBar";
import UpcomingEventsCard from "@/features/events/components/UpcomingEventsCard";
import { Container } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/events")({
  component: Component,
  loader: async ({ context: { queryUtils } }) =>
    queryUtils.auth.status.ensureData(),
});

function Component() {
  const loaderData = Route.useLoaderData();

  return (
    <>
      <DefaultAppBar title="Events" />
      <Container
        sx={{
          my: 2,
          flex: 1,
          overflowY: "auto",
          display: "flex",
        }}
      >
        <UpcomingEventsCard
          initialAuthStatus={loaderData}
          // initialEvents={loaderData.initialEvents}
        />
      </Container>
    </>
  );
}
