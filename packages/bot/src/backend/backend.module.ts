import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  type CreateTRPCClient,
  TRPCClientError,
  createTRPCClient,
  httpLink,
} from "@trpc/client";
import type { AppRouter } from "frontend";
import SuperJSON from "superjson";

export const BACKEND_TOKEN = Symbol("BACKEND_TOKEN");

export type BackendClient = { client: CreateTRPCClient<AppRouter> };

@Global()
@Module({
  providers: [
    {
      provide: BACKEND_TOKEN,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const backendTrpcUrl = config.getOrThrow<string>(
          "VITE_BACKEND_TRPC_URL",
        );
        const backendSecretToken = config.getOrThrow<string>(
          "VITE_BACKEND_SECRET_TOKEN",
        );

        /** The tRPC Client that connects to the backend */
        const client = createTRPCClient<AppRouter>({
          links: [
            httpLink({
              transformer: SuperJSON,
              url: backendTrpcUrl,
              fetch(url, options) {
                return fetch(url, {
                  ...options,
                  credentials: "include",
                  headers: {
                    Authorization: `Bearer ${backendSecretToken}`,
                    ...options?.headers,
                  },
                });
              },
              // You can pass any HTTP headers you wish here
            }),
          ],
        });
        return {
          client, // In an object so that nest doesn't try to run onModuleInit on it
        };
      },
    },
  ],
  exports: [BACKEND_TOKEN],
})
export class BackendModule {}

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
