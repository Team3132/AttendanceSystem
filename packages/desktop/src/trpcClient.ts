import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCClientProxy,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "backend";
import SuperJSON from "superjson";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";
import { createWSClient, tauriWsLink } from "./tauriWSLink";
// import { persistQueryClient } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
// import { compress, decompress } from "lz-string";

export const trpc = createTRPCReact<AppRouter>();

const backendUrl = new URL(`${import.meta.env.VITE_BACKEND_URL}/trpc`);

// change the protocol to ws
const wsBackendUrl = new URL(backendUrl.toString().replace("http", "ws"));

const wsClient = createWSClient({
  url: wsBackendUrl.toString(),
  // WebSocket: new WebSocket(1)
});

export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: tauriWsLink({
        client: wsClient,
      }),

      false: httpBatchLink({
        url: backendUrl.toString(),
        fetch: async (url, options) => {
          try {
            const response = await tauriFetch(url, {
              ...options,
              credentials: "include",
            });
  
            return response;
          } catch (error) {
            console.error("error", error);
            throw error;
          }
          
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

export const queryUtils = createTRPCQueryUtils({
  client: trpcClient,
  queryClient: queryClient,
});
