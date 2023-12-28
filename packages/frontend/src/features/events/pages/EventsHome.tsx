import { Container, Paper, Stack, Typography } from "@mui/material";
import ensureAuth from "../../../features/auth/utils/ensureAuth";
import DefaultAppBar from "../../../components/DefaultAppBar";
import UpcomingEventsCard from "../components/UpcomingEventsCard";
import { queryUtils } from "@/trpcClient";
import { DateTime } from "luxon";
import { useLoaderData } from "react-router-dom";

export async function loader() {
  const initialAuth = await ensureAuth();
  const initialEvents = await queryUtils.events.getEvents.ensureData({
    take: 5,
    from: DateTime.now().startOf("day").toISO() ?? undefined,
    to: DateTime.now().plus({ month: 1 }).startOf("day").toISO() ?? undefined,
    type: undefined,
  });
  return {
    initialAuth,
    initialEvents,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

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
