import * as React from "react";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import MuiAlert from "@/components/MuiAlert";
import { trpc, trpcClient, queryClient, queryUtils } from "@/trpcClient";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-alert";
import { HelmetProvider } from "react-helmet-async";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  queryUtils: typeof queryUtils;
}>()({
  component: RootComponent,
});

function RootComponent() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
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
            <Outlet />
          </Provider>
        </LocalizationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
