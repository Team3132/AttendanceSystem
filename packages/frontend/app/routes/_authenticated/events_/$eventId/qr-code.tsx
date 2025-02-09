import ScaninCard from "@/features/events/components/ScaninCard";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";
import { Container, Paper, Stack, Typography } from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/events_/$eventId/qr-code",
)({
  component: Component,
  beforeLoad: async ({ context: { queryClient }, params: { eventId } }) => {
    const { isAdmin } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );

    if (!isAdmin) {
      throw redirect({
        to: "/error",
        search: {
          message: "You are not an admin",
        },
      });
    }

    return {
      getTitle: async () => {
        const eventData = await queryClient.ensureQueryData(
          eventQueryOptions.eventDetails(eventId),
        );
        return `${eventData.title} - QR Code`;
      },
    };
  },
  loader: async ({ context: { queryClient }, params: { eventId } }) => {
    const eventData = await queryClient.ensureQueryData(
      eventQueryOptions.eventDetails(eventId),
    );
    await queryClient.prefetchQuery(eventQueryOptions.eventSecret(eventId));

    return { eventData };
  },
});

function Component() {
  const { eventId } = Route.useParams();

  const eventSecretQuery = useSuspenseQuery(
    eventQueryOptions.eventSecret(eventId),
  );

  return (
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
      <Stack
        sx={{
          py: 2,
        }}
        gap={2}
      >
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Stack gap={2}>
            <Typography variant="h5" textAlign={"center"}>
              Event Code
            </Typography>
            <Typography
              variant="body1"
              textAlign={"center"}
              fontFamily={"monospace"}
            >
              {eventSecretQuery.data.secret}
            </Typography>
          </Stack>
        </Paper>
        <ScaninCard eventId={eventId} />
      </Stack>
    </Container>
  );
}
