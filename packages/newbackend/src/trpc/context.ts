import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { user: req.user, headers: req.headers };
}

export type Context = inferAsyncReturnType<typeof createContext>;