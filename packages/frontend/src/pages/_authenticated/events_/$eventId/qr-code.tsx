import ScaninCard from "@/features/events/components/ScaninCard";
import { authQueryOptions } from "@/queries/auth.queries";
import { eventQueryOptions } from "@/queries/events.queries";
import {} from "@/trpcClient";
import { Container, Stack, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/events_/$eventId/qr-code",
)({
  component: Component,
  beforeLoad: async ({ context: { queryClient } }) => {
    const { isAdmin, isAuthenticated } = await queryClient.ensureQueryData(
      authQueryOptions.status(),
    );
    if (!isAdmin) {
      return {
        redirect: {
          to: "/",
        },
      };
    }
  },
  loader: async ({ context: { queryClient }, params: { eventId } }) => {
    const eventSecret = await queryClient.ensureQueryData(
      eventQueryOptions.eventSecret(eventId),
    );

    return {
      id: eventId,
      eventSecret: eventSecret,
    };
  },
});

function Component() {
  const loaderData = Route.useLoaderData();

  const eventSecretQuery = useQuery({
    ...eventQueryOptions.eventSecret(loaderData.id),
    initialData: loaderData.eventSecret,
  });

  if (eventSecretQuery.data) {
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
          <ScaninCard eventId={loaderData.id} />
        </Stack>
      </Container>
    );
  }

  return (
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
      <Stack gap={2}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h4" textAlign={"center"}>
            Loading...
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
