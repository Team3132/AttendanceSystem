import { TRPCClientError } from "@trpc/react-query";
import type { AppRouter } from "newbackend";

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
