import DeleteEventButton from "@/features/events/components/DeleteEventButton";
import RsvpList from "@/features/events/components/RSVPList";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";
import { Container, Grid, Paper, Typography, Stack } from "@mui/material";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DateTime } from "luxon";

export const Route = createFileRoute("/_authenticated/events_/$eventId/")({
  component: Component,
  loader: async ({ context: { queryClient }, params: { eventId } }) => {
    const eventData = await queryClient.ensureQueryData(
      eventQueryOptions.eventDetails(eventId),
    );
    await queryClient.prefetchQuery(authQueryOptions.status());
    await queryClient.prefetchQuery(eventQueryOptions.eventRsvps(eventId));
    await queryClient.prefetchQuery(eventQueryOptions.eventRsvp(eventId));

    return { eventData };
  },
  head: (ctx) => ({
    meta: ctx.loaderData
      ? [{ title: `${ctx.loaderData.eventData.title} - Details` }]
      : undefined,
  }),
});

function Component() {
  const { eventId } = Route.useParams();

  const eventQuery = useSuspenseQuery(eventQueryOptions.eventDetails(eventId));

  const authStatusQuery = useSuspenseQuery(authQueryOptions.status());

  return (
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
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
              {DateTime.fromMillis(
                Date.parse(eventQuery.data.startDate),
              ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={2}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">Duration</Typography>
            <Typography variant="body1">
              {DateTime.fromMillis(Date.parse(eventQuery.data.endDate))
                .diff(
                  DateTime.fromMillis(Date.parse(eventQuery.data.startDate)),
                  ["hours", "minutes"],
                )
                .toFormat("hh:mm")}
            </Typography>
          </Paper>
        </Grid>
        <Grid xs={12} md={5} item>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h5">End</Typography>
            <Typography variant="body1">
              {DateTime.fromMillis(
                Date.parse(eventQuery.data.endDate),
              ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
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
              <DeleteEventButton eventId={eventQuery.data.id} />
            </Stack>
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <RsvpList
            eventId={eventQuery.data.id}
            admin={authStatusQuery.data.isAdmin}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
