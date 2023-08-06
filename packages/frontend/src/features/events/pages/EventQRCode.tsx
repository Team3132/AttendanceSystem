import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import eventApi from "../../../api/query/event.api";
import queryClient from "../../../queryClient";
import ensureAuth from "../../auth/utils/ensureAuth";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import ErrorCard from "../../../components/ErrorCard";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import QRCode from "react-qr-code";
import { useMemo } from "react";
import ScaninCard from "../components/ScaninCard";

const EventUrlParamsSchema = z.object({
  eventId: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
  const initialAuthStatus = await ensureAuth(true);

  const { eventId } = EventUrlParamsSchema.parse(params);

  const initialEventSecret = await queryClient.ensureQueryData(
    eventApi.getEventSecret(eventId),
  );

  return {
    initialAuthStatus,
    initialEventSecret,
    eventId,
  };
}

export function Component() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const eventSecretQuery = useQuery({
    ...eventApi.getEventSecret(loaderData.eventId),
    initialData: loaderData.initialEventSecret,
  });

  const url = useMemo(
    () =>
      `${import.meta.env.VITE_BACKEND_URL}/event/${
        loaderData.eventId
      }/token/callback?code=${eventSecretQuery.data.secret}`,
    [eventSecretQuery.data.secret, loaderData.eventId],
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
          <Paper
            sx={{
              p: 2,
            }}
          >
            <Stack
              gap={2}
              sx={{
                alignItems: "center",
              }}
            >
              <Typography variant="h5" textAlign={"center"}>
                Event QR
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderRadius: 4,
                }}
              >
                <QRCode value={url} />
              </Box>
            </Stack>
          </Paper>
          <ScaninCard eventId={loaderData.eventId} />
        </Stack>
      </Container>
    );
  }

  if (eventSecretQuery.isError) {
    return <ErrorCard error={eventSecretQuery.error} />;
  }
}
