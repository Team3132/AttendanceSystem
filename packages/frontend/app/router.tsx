import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";
import {
  createTRPCClientProxy,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import SuperJSON from "superjson";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "backend";

// NOTE: Most of the integration code found here is experimental and will
// definitely end up in a more streamlined API in the future. This is just
// to show what's possible with the current APIs.

export function createRouter() {
  const queryClient = new QueryClient();

  const trpc = createTRPCReact<AppRouter>();

  const backendUrl = new URL(`${import.meta.env.VITE_BACKEND_URL}/trpc`);

  // change the protocol to ws
  const wsBackendUrl = new URL(backendUrl.toString().replace("http", "ws"));

  const wsClient = createWSClient({
    url: wsBackendUrl.toString(),
  });

  const trpcClient = trpc.createClient({
    links: [
      splitLink({
        condition: (op) => op.type === "subscription",
        true: wsLink({
          transformer: SuperJSON,
          client: wsClient,
        }),
        false: httpBatchLink({
          transformer: SuperJSON,
          url: backendUrl.toString(),
          fetch: async (url, options) => {
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

  const queryUtils = createTRPCQueryUtils({
    client: trpcClient,
    queryClient: queryClient,
  });

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient, queryUtils },
      defaultPreload: "intent",
    }),
    queryClient,
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
