import { trpc } from "@/trpcClient";
import { Container, Paper, Stack, Typography } from "@mui/material";
import { RouteApi } from "@tanstack/react-router";
import ScaninCard from "../components/ScaninCard";

const routeApi = new RouteApi({
  id: "/authedOnly/adminOnly/events/$eventId/qr-code",
});

export function Component() {
  const loaderData = routeApi.useLoaderData();

  const eventSecretQuery = trpc.events.getEventSecret.useQuery(
    loaderData.initialEvent.id,
    {
      initialData: loaderData.initialEventSecret,
    },
  );

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
          <ScaninCard eventId={loaderData.initialEvent.id} />
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
