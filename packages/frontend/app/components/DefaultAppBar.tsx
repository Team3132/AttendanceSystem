import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { FaCircleUser } from "react-icons/fa6";
import AsChildLink from "./AsChildLink";
import ModeSwitchButton from "./ModeSwitchButton";

interface DefaultAppBarProps {
  title: string;
}

export default function DefaultAppBar({ title }: DefaultAppBarProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
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
