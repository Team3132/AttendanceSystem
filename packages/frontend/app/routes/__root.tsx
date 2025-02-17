import Devtools from "@/components/Devtools";
import roboto300 from "@fontsource/roboto/300.css?url";
import robot400 from "@fontsource/roboto/400.css?url";
import roboto500 from "@fontsource/roboto/500.css?url";
import roboto700 from "@fontsource/roboto/700.css?url";
import { CssBaseline } from "@mui/material";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import type { QueryClient } from "@tanstack/react-query";
import { HeadContent } from "@tanstack/react-router";
import {
  ErrorComponent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Scripts } from "@tanstack/start";
import type * as React from "react";
import rootCss from "./root.css?inline";

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
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
    ],

    scripts: import.meta.env.DEV
      ? [
          {
            src: "https://unpkg.com/react-scan/dist/auto.global.js",
          },
        ]
      : undefined,
  }),
  errorComponent: ErrorComponent,
});

const attribute: "media" | "class" | "data" = "class";

const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
  cssVariables: {
    colorSchemeSelector: attribute,
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          adapterLocale={"en-au"}
          dateAdapter={AdapterLuxon}
        >
          <Outlet />
          <CssBaseline enableColorScheme />
        </LocalizationProvider>
      </ThemeProvider>

      <Devtools />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <style>{rootCss}</style>
      </head>
      <body>
        <InitColorSchemeScript attribute={attribute} />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
