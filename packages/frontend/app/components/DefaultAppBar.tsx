import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { FaCircleUser } from "react-icons/fa6";
import AsChildLink from "./AsChildLink";
import { useCallback, useMemo } from "react";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import SettingsSuggest from "@mui/icons-material/SettingsSuggest";

interface DefaultAppBarProps {
  title: string;
}

export default function DefaultAppBar({ title }: DefaultAppBarProps) {
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
            {title}
          </Typography>
          {/* <IconButton onClick={handleModeChange}>{modeIcon}</IconButton> */}
          <AsChildLink to="/profile">
            <IconButton>
              <FaCircleUser />
            </IconButton>
          </AsChildLink>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
