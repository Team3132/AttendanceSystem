import { QueryClient, QueryKey } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import env from "./api/env";
import { hc } from "hono/client";
import type { AppType } from "./api/hono";
import { AppRouter } from "./api";

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
