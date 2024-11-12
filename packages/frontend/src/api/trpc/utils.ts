import { TRPCError } from "@trpc/server";
import { t } from ".";
import env from "../env";
import { lucia } from "../auth/lucia";
import { Context } from "./context";
import { Session, User } from "lucia";

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

type OptionalSessionResult = Context &
  ({ user: null; session: null } | { user: User; session: Session });

/**
 * Optional session
 *
 * This middleware is used to process the session data for a request, and returns the user and session
 * data. If there is no session, it will return a null user and session.
 */
const optionalSession = t.middleware<OptionalSessionResult>(
  async ({ ctx, next }) => {
    try {
      const { user, session, req, res } = await sessionProcessor(ctx);

      return next({ ctx: { user, session, req, res } });
    } catch (error) {
      return next({
        ctx: { user: null, session: null, req: ctx.req, res: ctx.res },
      });
    }
  },
);

export const optionalSessionProcedure = t.procedure.use(optionalSession);

/**
 * Session processor
 *
 * This function processes the session data for a request, and returns the user and session data.
 */
const sessionProcessor = async (ctx: Context) => {
  const { req, res } = ctx;
  const { headers, cookies } = req;

  // Get the bearer token session
  const sessionIdAuthorization = lucia.readBearerToken(
    headers.authorization ?? "",
  );

  // If the Authorization Bearer strategy is used then we skip any cookie-related logic and just return the session details
  // It's the client's job to refresh the session should it be required
  if (sessionIdAuthorization) {
    const { session, user } = await lucia.validateSession(
      sessionIdAuthorization,
    );

    // If there's no valid session then pass the null user (fails rules)
    if (!session) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid session" });
    }

    return { user, session, req, res };
  }

  // If we're in a HTTP context, we can use cookies
  const sessionId = cookies?.[lucia.sessionCookieName];

  // If there's no session cookie, we're not logged in so create a blank cookie
  if (!sessionId) {
    const sessionCookie = lucia.createBlankSessionCookie();
    res.header("Set-Cookie", sessionCookie.serialize());

    throw new TRPCError({ code: "UNAUTHORIZED", message: "No session" });
  }

  const { session, user } = await lucia.validateSession(sessionId); // Validate the session

  // No session or invalid session so create a blank cookie
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();

    res.header("Set-Cookie", sessionCookie.serialize());

    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid session" });
  }

  // If the session is fresh, we need to update the cookie to extend the expiry
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.header("Set-Cookie", sessionCookie.serialize());
  }

  // Return the user, logOut function and headers
  return { user, session, req, res };
};

/**
 * Authenticated procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized, and you can access user session data.
 */
const enforceSession = t.middleware(async ({ ctx, next }) => {
  const { user, session, req, res } = await sessionProcessor(ctx);

  return next({ ctx: { user, session, req, res } });
});

/**
 * Passport Authenticated procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized, and you can access user session data.
 */
export const sessionProcedure = t.procedure.use(enforceSession);

const enforceMentorSession = t.middleware(async ({ ctx, next }) => {
  const { user, session, req, res } = await sessionProcessor(ctx);

  if (!user.roles) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No roles" });
  }

  if (!user.roles.includes(env.MENTOR_ROLE_ID)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not a mentor" });
  }

  return next({ ctx: { user: user, session, req, res } });
});

export const mentorSessionProcedure = t.procedure.use(enforceMentorSession);

/**
 * API Authenticated procedure (for the bot)
 */
const enforceApiToken = t.middleware(({ ctx, next }) => {
  const {
    req: { headers },
  } = ctx;

  if (!headers.authorization) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "API Token not set" });
  }

  const envApiToken = env.BACKEND_SECRET_TOKEN;

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
