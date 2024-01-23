import {
  createTRPCClientProxy,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import SuperJSON from "superjson";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "backend";
import { QueryClient } from "@tanstack/react-query";
// import { persistQueryClient } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
// import { compress, decompress } from "lz-string";

export const trpc = createTRPCReact<AppRouter>();

const backendUrl = new URL(`${import.meta.env["VITE_BACKEND_URL"]}/trpc`);

// change the protocol to ws
const wsBackendUrl = new URL(backendUrl.toString().replace("http", "ws"));

const wsClient = createWSClient({
  url: wsBackendUrl.toString(),
});

export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: import.meta.env.PROD
        ? wsLink({
            client: wsClient,
          })
        : httpBatchLink({
            url: backendUrl.toString(),
            fetch(url, options) {
              return fetch(url, {
                ...options,
                credentials: "include",
              });
            },
            // You can pass any HTTP headers you wish here
          }),
      false: httpBatchLink({
        url: backendUrl.toString(),
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

export const proxyclient = createTRPCClientProxy(trpcClient);

if (import.meta.env.PROD) {
  proxyclient.invalidator.subscribe(undefined, {
    onData: (key) => {
      queryClient.invalidateQueries({
        queryKey: key,
      });
      console.log("invalidated", key);
    },
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// const localStoragePersister = createSyncStoragePersister({
//   storage: window.localStorage,
//   serialize: (o) => compress(JSON.stringify(SuperJSON.serialize(o))),
//   deserialize: (o) => SuperJSON.deserialize(JSON.parse(decompress(o))),
// });

// persistQueryClient({
//   queryClient,
//   persister: localStoragePersister,
//   buster: import.meta.env["VITE_APP_VERSION"],
// });

export const queryUtils = createTRPCQueryUtils({
  client: trpcClient,
  queryClient: queryClient,
});
