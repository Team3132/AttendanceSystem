import type { AppRouter } from "@/server";
import { TRPCClientError } from "@trpc/client";

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
