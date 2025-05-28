import { z } from "zod";

const ERROR_CODES = z.union([
  z.literal("NOT_FOUND"),
  z.literal("UNAUTHORIZED"),
  z.literal("FORBIDDEN"),
  z.literal("BAD_REQUEST"),
  z.literal("INTERNAL_SERVER_ERROR"),
]);

const errorName = "StartServerError";

/**
 * Check that value is object
 * @internal
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && !Array.isArray(value) && typeof value === "object";
}

class UnknownCauseError extends Error {
  [key: string]: unknown;
}
function getCauseFromUnknown(cause: unknown): Error | undefined {
  if (cause instanceof Error) {
    return cause;
  }

  const type = typeof cause;
  if (type === "undefined" || type === "function" || cause === null) {
    return undefined;
  }

  // Primitive types just get wrapped in an error
  if (type !== "object") {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return new Error(String(cause));
  }

  // If it's an object, we'll create a synthetic error
  if (isObject(cause)) {
    const err = new UnknownCauseError();
    for (const key in cause) {
      err[key] = cause[key];
    }
    return err;
  }

  return undefined;
}

function getServerErrorFromUnknown(cause: unknown): ServerError {
  if (cause instanceof ServerError) {
    return cause;
  }
  if (cause instanceof Error && cause.name === "ServerError") {
    // https://github.com/trpc/trpc/pull/4848
    return cause as ServerError;
  }

  const trpcError = new ServerError({
    code: "INTERNAL_SERVER_ERROR",
    cause,
  });

  // Inherit stack from error
  if (cause instanceof Error && cause.stack) {
    trpcError.stack = cause.stack;
  }

  return trpcError;
}

/**
 * Error class for server errors
 * This is used to recognise server errors in the client
 * e.g. Not Found, Unauthorized, Forbidden, Bad Request, Internal Server Error etc.
 */
export class ServerError extends Error {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore override doesn't work in all environments due to "This member cannot have an 'override' modifier because it is not declared in the base class 'Error'"
  public override readonly cause?: Error;
  public readonly code;

  constructor(opts: {
    message?: string;
    code: z.infer<typeof ERROR_CODES>;
    cause?: unknown;
  }) {
    const cause = getCauseFromUnknown(opts.cause);
    const message = opts.message ?? cause?.message ?? opts.code;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore https://github.com/tc39/proposal-error-cause
    super(message, { cause });

    this.code = opts.code;
    this.name = errorName;

    if (!this.cause) {
      // Don't set cause in production to avoid leaking sensitive information
      // < ES2022 / < Node 16.9.0 compatability
      this.cause = cause;
    }
  }
}

export function isServerError(value: unknown): value is ServerError {
  if (!(value instanceof Error)) {
    return false;
  }
  return value.name === errorName;
}
