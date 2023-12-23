import { httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "newbackend";
import { QueryClient } from "@tanstack/react-query";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: `${import.meta.env["VITE_BACKEND_URL"]}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      // You can pass any HTTP headers you wish here
    }),
  ],
});

export const queryClient = new QueryClient();

export const queryUtils = createTRPCQueryUtils({
  client: trpcClient,
  queryClient: queryClient,
});
