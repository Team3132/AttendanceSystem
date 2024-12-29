import * as React from "react";
import {
  Link,
  Outlet,
  RouterProvider,
  ScrollRestoration,
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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { QueryClient } from "@tanstack/react-query";
import { Meta, Scripts } from "@tanstack/start";
import { CacheProvider } from "@emotion/react";
import roboto300 from "@fontsource/roboto/300.css?url";
import robot400 from "@fontsource/roboto/400.css?url";
import roboto500 from "@fontsource/roboto/500.css?url";
import roboto700 from "@fontsource/roboto/700.css?url";
import appCss from "@/index.css?url";
import createCache from "@emotion/cache";

const emotionCache = createCache({ key: "css" });

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TDU Attendance System",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: roboto300,
      },
      {
        rel: "stylesheet",
        href: robot400,
      },
      {
        rel: "stylesheet",
        href: roboto500,
      },
      {
        rel: "stylesheet",
        href: roboto700,
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: import.meta.env.DEV
      ? [
          {
            src: "https://unpkg.com/react-scan/dist/auto.global.js",
            async: true,
          },
        ]
      : undefined,
  }),
});

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider
              adapterLocale={"en-au"}
              dateAdapter={AdapterLuxon}
            >
              {children}
            </LocalizationProvider>
            <CssBaseline />
          </ThemeProvider>
        </CacheProvider>
        <ScrollRestoration />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
