import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import ensureAuth from "../../auth/utils/ensureAuth";
import { Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { z } from "zod";
import { DateTime } from "luxon";
import RsvpList from "../components/RSVPList";
import DeleteEventButton from "../components/DeleteEventButton";
import { trpc } from "@/trpcClient";
import { queryUtils } from "@/trpcClient";

const EventParamsSchema = z.object({
  eventId: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const initialAuthStatus = await ensureAuth();

  const { eventId } = EventParamsSchema.parse(params);

  const initialEventData = await queryUtils.events.getEvent.ensureData(eventId);

  return {
    eventId,
    initialAuthStatus,
    initialEventData,
  };
}

export function Component() {
  const { initialEventData, initialAuthStatus, eventId } =
    useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const eventQuery = trpc.events.getEvent.useQuery(initialEventData.id, {
    initialData: initialEventData,
  });

  const authStatusQuery = trpc.auth.status.useQuery(undefined, {
    initialData: initialAuthStatus,
  });

  return (
    <Container
      sx={{
        overflow: "auto",
        my: 2,
      }}
    >
      <Grid container spacing={2} py={2}>
        {eventQuery.data.description ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" textAlign={"center"}>
                Description
              </Typography>
              <Typography variant="body1">
                {eventQuery.data.description}
              </Typography>
            </Paper>
          </Grid>
        ) : null}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">Start</Typography>
            <Typography variant="body1">
              {DateTime.fromISO(eventQuery.data.startDate).toLocaleString(
                DateTime.DATETIME_MED_WITH_WEEKDAY
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={2}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">Duration</Typography>
            <Typography variant="body1">
              {DateTime.fromISO(eventQuery.data.endDate)
                .diff(DateTime.fromISO(eventQuery.data.startDate), [
                  "hours",
                  "minutes",
                ])
                .toFormat("hh:mm")}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} md={5} item>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">End</Typography>
            <Typography variant="body1">
              {DateTime.fromISO(eventQuery.data.endDate).toLocaleString(
                DateTime.DATETIME_MED_WITH_WEEKDAY
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">Type</Typography>
            <Typography variant="body1">{eventQuery.data.type}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">All Day</Typography>
            <Typography variant="body1">
              {eventQuery.data.allDay ? "Yes" : "No"}
            </Typography>
          </Paper>
        </Grid>
        {authStatusQuery.data.isAdmin ? (
          <Grid item xs={12}>
            <Stack spacing={2} direction="row">
              <DeleteEventButton eventId={initialEventData.id} />
            </Stack>
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <RsvpList eventId={eventId} admin={authStatusQuery.data.isAdmin} />
        </Grid>
      </Grid>
    </Container>
  );
}
