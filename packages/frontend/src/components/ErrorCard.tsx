import { Paper, Stack, Typography } from "@mui/material";
import { ApiError } from "../api/generated";

interface ErrorCardProps {
  error: ApiError;
}

export default function ErrorCard({ error }: ErrorCardProps) {
  return (
    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Stack gap={2}>
        <Typography variant="h4">Error</Typography>
        <Typography variant="body1">{error.message}</Typography>
        {error.stack ? (
          <Typography
            variant="body1"
            fontFamily={"monospace"}
            textAlign={"left"}
          >
            {error.stack}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}
