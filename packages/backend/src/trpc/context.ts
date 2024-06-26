import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req }: CreateFastifyContextOptions) {
  const { user, headers } = req;

  const logOut = () => req.logOut();

  return { user, headers, logOut };
}

export type Context = inferAsyncReturnType<typeof createContext>;
