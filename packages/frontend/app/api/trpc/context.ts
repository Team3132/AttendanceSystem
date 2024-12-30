import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<unknown> {
  return {};
}
