import { IconButton, useColorScheme } from "@mui/material";
import { useCallback, useMemo } from "react";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import SettingsBrightness from "@mui/icons-material/SettingsBrightness";

const modes = ["light", "dark", "system"] as const;

export default function ModeSwitchButton() {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const modeIcon = useMemo(() => {
    if (mode === "light") {
      return <LightMode />;
    }

    if (mode === "dark") {
      return <DarkMode />;
    }

    return <SettingsBrightness />;
  }, [mode]);

  const handleModeChange = useCallback(() => {
    const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];
    setMode(nextMode);
  }, [mode, setMode]);

  return (
    <IconButton onClick={handleModeChange} color="inherit">
      {modeIcon}
    </IconButton>
  );
}
