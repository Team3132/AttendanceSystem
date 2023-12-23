import { createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import SuperJSON from "superjson";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "backend";
import { QueryClient } from "@tanstack/react-query";

export const trpc = createTRPCReact<AppRouter>();

const wsClient = createWSClient({
  url: `${import.meta.env["VITE_BACKEND_URL"]}/trpc`,
});

export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: `${import.meta.env["VITE_BACKEND_URL"]}/trpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
        // You can pass any HTTP headers you wish here
      }),
    }),
  ],
});

export const queryClient = new QueryClient();

export const queryUtils = createTRPCQueryUtils({
  client: trpcClient,
  queryClient: queryClient,
});
