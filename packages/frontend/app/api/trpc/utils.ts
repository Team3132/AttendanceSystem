import { TRPCError } from "@trpc/server";
import { t } from ".";
import env from "../env";
import { lucia } from "../auth/lucia";
import { Session, User } from "lucia";
import { getCookie, getHeader, setCookie } from "vinxi/http";

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

type OptionalSessionResult =
  | { user: null; session: null }
  | { user: User; session: Session };

/**
 * Optional session
 *
 * This middleware is used to process the session data for a request, and returns the user and session
 * data. If there is no session, it will return a null user and session.
 */
const optionalSession = t.middleware<OptionalSessionResult>(
  async ({ ctx, next }) => {
    try {
      const { user, session, ...restCtx } = await sessionProcessor();

      return next({ ctx: { user, session, ...restCtx } });
    } catch (error) {
      return next({
        ctx: { user: null, session: null, ...ctx },
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
const sessionProcessor = async () => {
  const authorizationHeader = getHeader("authorization");

  // Get the bearer token session
  const sessionIdAuthorization = lucia.readBearerToken(
    authorizationHeader ?? "",
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

    return { user, session };
  }

  // If we're in a HTTP context, we can use cookies
  const sessionId = getCookie(lucia.sessionCookieName);

  // If there's no session cookie, we're not logged in so create a blank cookie
  if (!sessionId) {
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    throw new TRPCError({ code: "UNAUTHORIZED", message: "No session" });
  }

  const { session, user } = await lucia.validateSession(sessionId); // Validate the session

  // No session or invalid session so create a blank cookie
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();

    setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid session" });
  }

  // If the session is fresh, we need to update the cookie to extend the expiry
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  // Return the user, logOut function and headers
  return { user, session };
};

/**
 * Authenticated procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized, and you can access user session data.
 */
const enforceSession = t.middleware(async ({ next }) => {
  const { user, session } = await sessionProcessor();

  return next({ ctx: { user, session } });
});

/**
 * Passport Authenticated procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized, and you can access user session data.
 */
export const sessionProcedure = t.procedure.use(enforceSession);

const enforceMentorSession = t.middleware(async ({ next }) => {
  const { user, session } = await sessionProcessor();

  if (!user.roles) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No roles" });
  }

  if (!user.roles.includes(env.VITE_MENTOR_ROLE_ID)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not a mentor" });
  }

  return next({ ctx: { user, session } });
});

export const mentorSessionProcedure = t.procedure.use(enforceMentorSession);

/**
 * API Authenticated procedure (for the bot)
 */
const enforceApiToken = t.middleware(({ next }) => {
  const authorizationHeader = getHeader("authorization");

  if (!authorizationHeader) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "API Token not set" });
  }

  const envApiToken = env.VITE_BACKEND_SECRET_TOKEN;

  if (!envApiToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "API Token not set in config",
    });
  }

  if (authorizationHeader !== `Bearer ${envApiToken}`) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid API Token" });
  }

  return next();
});

/**
 * API Authenticated procedure
 */
export const tokenProcedure = t.procedure.use(enforceApiToken);
