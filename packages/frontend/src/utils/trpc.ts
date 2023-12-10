import { TRPCClientError, createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "newbackend";
export const trpc = createTRPCReact<AppRouter>();

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
