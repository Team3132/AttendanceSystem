import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { useMemo } from "react";
import { Provider } from "react-alert";
import { HelmetProvider } from "react-helmet-async";
import MuiAlert from "./components/MuiAlert";
import router from "./router";
import { queryClient, trpc, trpcClient } from "./trpcClient";

/**
 * The root component of the application.
 */
function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  );

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="en-au">
          <Provider template={MuiAlert} position="bottom center">
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
              <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
              </QueryClientProvider>
            </trpc.Provider>
          </Provider>
        </LocalizationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
