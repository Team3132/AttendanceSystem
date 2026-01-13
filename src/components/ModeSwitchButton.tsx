import { IconButton } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { useCallback, useMemo } from "react";
import { MdDarkMode, MdLightMode, MdSettingsBrightness } from "react-icons/md";

const modes = ["light", "dark", "system"] as const;

export default function ModeSwitchButton() {
  const { mode, setMode } = useColorScheme();

  const modeIcon = useMemo(() => {
    if (mode === "light") {
      return <MdLightMode />;
    }

    if (mode === "dark") {
      return <MdDarkMode />;
    }

    return <MdSettingsBrightness />;
  }, [mode]);

  const handleModeChange = useCallback(() => {
    if (!mode) {
      return;
    }

    const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];
    setMode(nextMode);
  }, [mode, setMode]);

  if (!mode) {
    return <></>;
  }

  return (
    <IconButton onClick={handleModeChange} color="inherit">
      {modeIcon}
    </IconButton>
  );
}
