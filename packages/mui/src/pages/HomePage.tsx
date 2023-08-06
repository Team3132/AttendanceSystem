import {
  AppBar,
  Container,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ensureAuth from "../features/auth/utils/ensureAuth";
import { FaCircleUser } from "react-icons/fa6";

export async function loader() {
  await ensureAuth();
  return null;
}

export function Component() {
  return (
    <>
      <AppBar
        position="absolute"
        sx={{
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
          <IconButton>
            <FaCircleUser />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container
        sx={{
          my: 2,
        }}
      >
        <Stack gap={2}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4">
              Welcome to the Attendance System
            </Typography>
            <Typography variant="body1">
              This is the attendance system for the FRC team 3132 Thunder Down
              Under. This system is used to track attendance for team members at
              events and outreach activities.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
