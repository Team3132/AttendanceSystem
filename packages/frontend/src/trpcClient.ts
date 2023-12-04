import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { trpc } from "./utils/trpc";
import SuperJSON from "superjson";
import { AppRouter } from "newbackend";

export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_BACKEND_URL}/trpc`,
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

export const trpcProxyClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_BACKEND_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      // You can pass any HTTP headers you wish here
    }),
  ],
  transformer: SuperJSON,
});
