import { DefaultError, UseMutationOptions } from "@tanstack/react-query";
import { CancelablePromise } from "../generated";

export function cancelableQuery<T>(
  cancellablePromise: CancelablePromise<T>,
  signal: AbortSignal,
): Promise<T> {
  signal.addEventListener("abort", () => cancellablePromise.cancel());
  return cancellablePromise;
}

export function mutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationOptions<TData, TError, TVariables, TContext> {
  return options;
}
