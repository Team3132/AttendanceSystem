import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import ensureAuth from "../../auth/utils/ensureAuth";
import { z } from "zod";
import { Container, Paper, Stack, Typography } from "@mui/material";
import ScaninCard from "../components/ScaninCard";
import { trpc } from "@/trpcClient";
import { queryUtils } from "@/trpcClient";

const EventUrlParamsSchema = z.object({
  eventId: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const initialAuthStatus = await ensureAuth(true);

  const { eventId } = EventUrlParamsSchema.parse(params);

  const initialEventSecret =
    await queryUtils.events.getEventSecret.ensureData(eventId);

  return {
    initialAuthStatus,
    initialEventSecret,
    eventId,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const eventSecretQuery = trpc.events.getEventSecret.useQuery(
    loaderData.eventId,
    {
      initialData: loaderData.initialEventSecret,
    }
  );

  if (eventSecretQuery.data) {
    return (
      <Container
        sx={{
          overflow: "auto",
          my: 2,
        }}
      >
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
          <ScaninCard eventId={loaderData.eventId} />
        </Stack>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        my: 2,
        overflow: "auto",
      }}
    >
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
