import { createTheme } from "@mui/material";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { CreateQueryUtils } from "@trpc/react-query/shared";
import { AppRouter } from "backend";
import { useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    queryUtils: CreateQueryUtils<AppRouter>
}>()({
    component: RootComponent,
})

function RootComponent() {
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
    return <>
    </>
}