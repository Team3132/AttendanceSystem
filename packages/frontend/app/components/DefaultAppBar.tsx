import {
  AppBar,
  IconButton,
  Stack,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { FaCircleUser } from "react-icons/fa6";
import AsChildLink from "./AsChildLink";
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
          <AsChildLink to="/profile">
            <IconButton color="inherit">
              <FaCircleUser />
            </IconButton>
          </AsChildLink>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
