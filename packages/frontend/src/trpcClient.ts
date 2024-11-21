import { QueryCache, QueryClient, QueryKey } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import env from "./api/env";
import { hc } from "hono/client";
import type { AppType } from "./api/hono";
import { AppRouter } from "./api";
import { isTRPCClientError } from "./utils/trpc";

const backendUrl = new URL(`${env.VITE_PUBLIC_BACKEND_URL}/trpc`);

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: backendUrl.toString(),
      fetch: async (url, options) => {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    /**
     * Global error handler for non-user facing errors and auth errors
     * @param error
     */
    onError: (error) => {
      if (isTRPCClientError(error)) {
        console.log(error);
      } else if (error instanceof Error) {
        console.log(error);
      } else if (error instanceof Response) {
        if (error.status === 401) {
          window.location.href = "/login";
        } else {
          console.log(error);
        }
      } else {
        console.log(error);
      }
    },
  }),
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});
try {
  // add websocket listener
  const ws = new WebSocket(
    `ws${backendUrl.protocol === "https:" ? "s" : ""}://${backendUrl.host}/api/ws`,
  );

  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data) as QueryKey;
    queryClient.invalidateQueries({
      queryKey: data,
    });
  });
} catch (error) {
  console.error(error);
}

export const appClient = hc<AppType>(
  `${backendUrl.protocol}//${backendUrl.host}/`,
);
