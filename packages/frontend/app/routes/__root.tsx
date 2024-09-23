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
} from "@mui/material";
import MuiAlert from "@/components/MuiAlert";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { QueryClient } from "@tanstack/react-query";
import { Provider } from "react-alert";
import { ScrollRestoration } from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  queryUtils: typeof queryUtils;
}>()({
  component: RootComponent,
});

const theme = createTheme({
  colorSchemes: {
    dark: true,
  }
});

function RootComponent() {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="en-au">
          <Provider template={MuiAlert} position="bottom center">
            <Outlet />
          </Provider>
        </LocalizationProvider>
      </ThemeProvider>
      <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
