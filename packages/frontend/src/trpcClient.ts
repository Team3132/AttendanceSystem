import {
  createTRPCClientProxy,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import SuperJSON from 'superjson';
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from 'backend';
import { QueryClient } from '@tanstack/react-query';

export const trpc = createTRPCReact<AppRouter>();

const backendUrl = new URL(`${import.meta.env['VITE_BACKEND_URL']}/trpc`);

// change the protocol to ws
const wsBackendUrl = new URL(backendUrl.toString().replace('http', 'ws'));

const wsClient = createWSClient({
  url: wsBackendUrl.toString(),
});

export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: backendUrl.toString(),
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          });
        },
        // You can pass any HTTP headers you wish here
      }),
    }),
  ],
});

export const proxyclient = createTRPCClientProxy(trpcClient);

proxyclient.invalidator.subscribe(undefined, {
  onData: (key) => {
    queryClient.invalidateQueries({
      queryKey: key,
    });
    console.log('invalidated', key);
  },
});

export const queryClient = new QueryClient();

export const queryUtils = createTRPCQueryUtils({
  client: trpcClient,
  queryClient: queryClient,
});
