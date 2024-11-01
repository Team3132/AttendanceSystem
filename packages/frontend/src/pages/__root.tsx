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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { QueryClient } from "@tanstack/react-query";
import { Provider } from "react-alert";
import { HelmetProvider } from "react-helmet-async";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

function RootComponent() {
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
