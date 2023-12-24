import { isTRPCClientError } from "@/utils/trpc";
import { Stack, Typography } from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorBoundaryPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Stack gap={2} my={2}>
        <Typography variant="h5" textAlign={"center"}>
          {error.status}
        </Typography>
        <Typography variant="h5" textAlign={"center"}>
          {error.statusText}
        </Typography>
        {error.data ? (
          <Typography
            variant="body1"
            textAlign={"center"}
            fontFamily={"monospace"}
          >
            {error.data.message}
          </Typography>
        ) : null}
      </Stack>
    );
  }

  if (isTRPCClientError(error)) {
    return (
      <Stack gap={2} my={2}>
        <Typography variant="h5" textAlign={"center"}>
          {error.name}
        </Typography>
        {error.message ? (
          <Typography
            variant="body1"
            textAlign={"center"}
            fontFamily={"monospace"}
          >
            {error.message}
          </Typography>
        ) : null}
      </Stack>
    );
  }

  if (error instanceof Error) {
    return (
      <Stack gap={2} my={2}>
        <Typography variant="h5" textAlign={"center"}>
          {error.name}
        </Typography>
        <Typography variant="h5" textAlign={"center"}>
          {error.message}
        </Typography>
        {error.stack ? (
          <Typography
            variant="body1"
            textAlign={"center"}
            fontFamily={"monospace"}
          >
            {error.stack}
          </Typography>
        ) : null}
      </Stack>
    );
  }

  return (
    <Stack gap={2} my={2}>
      <Typography variant="h5" textAlign={"center"}>
        An unknown error occurred
      </Typography>
    </Stack>
  );
}
