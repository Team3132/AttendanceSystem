import { QueryClient } from "@tanstack/react-query";
import { createTRPCClientProxy, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "backend";
import SuperJSON from "superjson";

const trpc = createTRPCReact<AppRouter>();

const backendUrl = new URL(`${import.meta.env.VITE_BACKEND_URL}/trpc`);

export const trpcClient = trpc.createClient({
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

export const proxyClient = createTRPCClientProxy(trpcClient);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});
