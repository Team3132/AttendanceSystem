import { AppBar, Stack, Toolbar, Typography, styled } from "@mui/material";
import { FaCircleUser } from "react-icons/fa6";
import { LinkIconButton } from "./LinkIconButton";
import ModeSwitchButton from "./ModeSwitchButton";

interface DefaultAppBarProps {
  title: string;
}

const GrowingTypography = styled(Typography)({
  flexGrow: 1,
});

export default function DefaultAppBar({ title }: DefaultAppBarProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        <GrowingTypography variant="h6" as="div">
          {title}
        </GrowingTypography>
        <Stack direction="row" spacing={1}>
          <ModeSwitchButton />
          <LinkIconButton to="/profile" color="inherit">
            <FaCircleUser />
          </LinkIconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
