import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  return {
    req,
    res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
