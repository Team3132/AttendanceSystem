import { Container } from "@mui/material";
import { RouteApi } from "@tanstack/react-router";
import DefaultAppBar from "../../../components/DefaultAppBar";
import UpcomingEventsCard from "../components/UpcomingEventsCard";

const routeApi = new RouteApi({ id: "/authedOnly/events/" });

export function Component() {
  const loaderData = routeApi.useLoaderData();

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
          initialAuthStatus={loaderData.initialAuth}
          // initialEvents={loaderData.initialEvents}
        />
      </Container>
    </>
  );
}
