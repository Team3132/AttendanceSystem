import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import eventApi from "../../../api/query/event.api";
import queryClient from "../../../queryClient";
import ensureAuth from "../../auth/utils/ensureAuth";
import { useQuery } from "@tanstack/react-query";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { z } from "zod";
import { DateTime } from "luxon";
import RoleText from "../../../components/RoleText";
import RsvpList from "../components/RSVPList";
import MyRsvpStatus from "../components/MyRsvpStatus";

const EventParamsSchema = z.object({
  eventId: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const initialAuthStatus = await ensureAuth();

  const { eventId } = EventParamsSchema.parse(params);

  const initialEventData = await queryClient.ensureQueryData(
    eventApi.getEvent(eventId),
  );

  return {
    initialAuthStatus,
    initialEventData,
  };
}

export function Component() {
  const { initialEventData } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  const eventQuery = useQuery({
    ...eventApi.getEvent(initialEventData.id),
    initialData: initialEventData,
  });

  return (
    <Container>
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
                DateTime.DATETIME_MED_WITH_WEEKDAY,
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
                DateTime.DATETIME_MED_WITH_WEEKDAY,
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
        {eventQuery.data.roles.length ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5">Roles</Typography>
              <Typography variant="body1">
                {eventQuery.data.roles
                  .map((role) => <RoleText roleId={role} />)
                  .join(", ")}
              </Typography>
            </Paper>
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <RsvpList eventId={initialEventData.id} />
        </Grid>
      </Grid>
    </Container>
  );
}
