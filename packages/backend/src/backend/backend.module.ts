import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateTRPCClient,
  TRPCClientError,
  createTRPCClient,
  httpBatchLink,
} from '@trpc/client';
import type { AppRouter } from 'newbackend';
import SuperJSON from 'superjson';

export const BACKEND_TOKEN = Symbol('BACKEND_TOKEN');

export type BackendClient = { client: CreateTRPCClient<AppRouter> };

@Global()
@Module({
  providers: [
    {
      provide: BACKEND_TOKEN,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const backendTrpcUrl = config.getOrThrow<string>('BACKEND_TRPC_URL');
        const backendSecretToken = config.getOrThrow<string>(
          'BACKEND_SECRET_TOKEN',
        );

        const client = createTRPCClient<AppRouter>({
          transformer: SuperJSON,
          links: [
            httpBatchLink({
              url: backendTrpcUrl,
              fetch(url, options) {
                return fetch(url, {
                  ...options,
                  credentials: 'include',
                  headers: {
                    Authorization: `Bearer ${backendSecretToken}`,
                  },
                });
              },
              // You can pass any HTTP headers you wish here
            }),
          ],
        });
        return {
          onModuleInit() {}, // OnModuleInit so that nestjs doesn't try and call a onModuleInit trpc method
          client,
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
