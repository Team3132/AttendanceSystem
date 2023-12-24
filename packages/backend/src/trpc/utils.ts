import { TRPCError } from "@trpc/server";
import { t } from ".";
import env from "../env";

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Authenticated procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized, and you can access user session data.
 */
const enforceSession = t.middleware(({ ctx, next }) => {
  const ctxUser = ctx.user;

  if (!ctxUser) {
    // Redirect to login page?
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No session" });
  }

  return next({ ctx: { user: ctxUser } });
});

/**
 * Passport Authenticated procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized, and you can access user session data.
 */
export const sessionProcedure = t.procedure.use(enforceSession);

const enforceMentorSession = t.middleware(({ ctx, next }) => {
  const ctxUser = ctx.user;

  if (!ctxUser) {
    // Redirect to login page?
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No session" });
  }

  if (!ctxUser.roles) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No roles" });
  }

  if (!ctxUser.roles.includes(env.MENTOR_ROLE_ID)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not a mentor" });
  }

  return next({ ctx: { user: ctxUser } });
});

export const mentorSessionProcedure = t.procedure.use(enforceMentorSession);

/**
 * API Authenticated procedure (for the bot)
 */
const enforceApiToken = t.middleware(({ ctx, next }) => {
  const { headers } = ctx;

  if (!headers.authorization) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "API Token not set" });
  }

  const envApiToken = env.BACKEND_TRPC_URL;

  if (!envApiToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "API Token not set in config",
    });
  }

  if (headers.authorization !== `Bearer ${envApiToken}`) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid API Token" });
  }

  return next();
});

/**
 * API Authenticated procedure
 */
export const tokenProcedure = t.procedure.use(enforceApiToken);
