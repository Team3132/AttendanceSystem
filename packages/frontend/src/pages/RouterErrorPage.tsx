import { isTRPCClientError } from "@/utils/trpc";
import { Stack, Typography } from "@mui/material";

interface ErrorBoundaryPageProps {
  error: unknown;
}

export default function ErrorBoundaryPage(props: ErrorBoundaryPageProps) {
  const error = props.error;
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
