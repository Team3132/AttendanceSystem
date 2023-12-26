import { TRPCClientError } from "@trpc/react-query";
import type { AppRouter } from "@team3132/attendance-backend";

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
