import { TRPCError } from "@trpc/server";
import { t } from ".";
import fastifyPassport from "@fastify/passport";
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
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { user: ctxUser, db: ctx.db } });
});

/**
 * Passport Authenticated procedure
 * 
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized, and you can access user session data.
 */
export const sessionProcedure = t.procedure.use(enforceSession);

/**
 * API Authenticated procedure (for the bot)
 */
const enforceApiToken = t.middleware(({ ctx, next }) => {
  const { headers, db } = ctx;

  if (!headers.authorization) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "API Token not set" });
  }

  if (!env.API_TOKEN) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "API Token not set in config",
    });
  }

  if (headers.authorization !== `Bearer ${env.API_TOKEN}`) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid API Token" });
  }

  return next({ ctx: { db } });
});

/**
 * API Authenticated procedure
 */
export const tokenProcedure = t.procedure.use(enforceApiToken);