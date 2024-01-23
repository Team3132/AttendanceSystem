import { Container, Stack, Paper } from "@mui/material";

export default function AdminRecentRsvps() {
  return (
    <Container sx={{ my: 2, flex: 1, overflowY: "auto" }}>
      <Stack py={2} gap={2}>
        <Paper sx={{ p: 2 }}>
          <Stack gap={2}>Testing</Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
