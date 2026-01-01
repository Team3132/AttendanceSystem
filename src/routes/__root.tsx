import Devtools from "@/components/Devtools";
import GenericServerErrorBoundary from "@/components/GenericServerErrorBoundary";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import fontsourceVariableRobotoCss from "@fontsource-variable/roboto?url";
import { CssBaseline } from "@mui/material";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import type { QueryClient } from "@tanstack/react-query";
import { HeadContent } from "@tanstack/react-router";
import {
  ErrorComponent,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Scripts } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import type * as React from "react";
import rootCss from "./root.css?inline";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  shellComponent: RootShell,
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
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
      { rel: "stylesheet", href: fontsourceVariableRobotoCss },
    ],
    styles: [
      {
        children: rootCss,
      },
    ],

    // scripts: import.meta.env.DEV
    //   ? [
    //       {
    //         src: "https://unpkg.com/react-scan/dist/auto.global.js",
    //       },
    //     ]
    //   : undefined,
  }),
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <InitColorSchemeScript attribute={attribute} />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Providers>
        <GenericServerErrorBoundary>
          <Outlet />
        </GenericServerErrorBoundary>
      </Providers>
      <Devtools />
    </>
  );
}

const attribute = "data";

const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
  cssVariables: {
    colorSchemeSelector: attribute,
  },
  typography: {
    fontFamily: "'Roboto Variable', sans-serif",
  },
});

function ThemeProviderWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const emotionCache = createCache({ key: "css" });

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviderWrapper>
      <LocalizationProvider adapterLocale={"en-au"} dateAdapter={AdapterLuxon}>
        {children}
      </LocalizationProvider>
    </ThemeProviderWrapper>
  );
}
