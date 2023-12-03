import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const logOut = () => req.logOut();

  const { user, headers } = req;

  return { user, headers, logOut };
}

export type Context = inferAsyncReturnType<typeof createContext>;
