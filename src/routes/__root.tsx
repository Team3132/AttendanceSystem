import Devtools from "@/components/Devtools";
import GenericServerErrorBoundary from "@/components/GenericServerErrorBoundary";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import roboto300 from "@fontsource/roboto/300.css?inline";
import robot400 from "@fontsource/roboto/400.css?inline";
import roboto500 from "@fontsource/roboto/500.css?inline";
import roboto700 from "@fontsource/roboto/700.css?inline";
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

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
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

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <style>{rootCss}</style>
        <style>{roboto300}</style>
        <style>{robot400}</style>
        <style>{roboto500}</style>
        <style>{roboto700}</style>
      </head>
      <body>
        <InitColorSchemeScript attribute={attribute} />
        <Providers>
          <GenericServerErrorBoundary>{children}</GenericServerErrorBoundary>
        </Providers>
        <Devtools />
        <Scripts />
      </body>
    </html>
  );
}
