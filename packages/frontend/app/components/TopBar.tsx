import { AppBar, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {} from "@tanstack/react-query";
import { FaCircleUser } from "react-icons/fa6";
import { LinkIconButton } from "./LinkIconButton";
import ModeSwitchButton from "./ModeSwitchButton";

const GrowingTypography = styled(Typography)({
  flexGrow: 1,
});

const SpacedToolbar = styled(Toolbar)(({ theme }) => ({
  gap: theme.spacing(1),
}));

export default function TopBar() {
  return (
    <AppBar position="static">
      <SpacedToolbar>
        <GrowingTypography variant="h6" as="div">
          TDU Attendance
        </GrowingTypography>
        <ModeSwitchButton />
        <LinkIconButton to="/profile" color="inherit">
          <FaCircleUser />
        </LinkIconButton>
      </SpacedToolbar>
    </AppBar>
  );
}
