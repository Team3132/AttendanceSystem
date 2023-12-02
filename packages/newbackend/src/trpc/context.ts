import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { db } from '../drizzle/db';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { db, user: req.user, headers: req.headers };
}

export type Context = inferAsyncReturnType<typeof createContext>;