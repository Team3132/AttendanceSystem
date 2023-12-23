import { httpBatchLink } from "@trpc/client";
import { trpc } from "./utils/trpc";
import SuperJSON from "superjson";

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
