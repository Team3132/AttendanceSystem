import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Context } from "hono";

export async function createContext(
  _opts: FetchCreateContextFnOptions,
  c: Context,
) {
  return { c };
}

export type TRPCContext = Awaited<ReturnType<typeof createContext>>;
