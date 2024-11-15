import { createMiddleware } from "hono/factory";
import { lucia } from "../auth/lucia";
import { getCookie, setCookie } from "hono/cookie";
import { HonoEnv } from "../hono";
import { Context, MiddlewareHandler } from "hono";
import { Session, User } from "lucia";

const authProcessor = async (
  c: Context<HonoEnv>,
): Promise<
  { user: null; session: null } | { user: User; session: Session }
> => {
  const authorizationHeader = c.req.raw.headers.get("authorization");

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
      throw new Response(null, { status: 401 });
    }

    return { user, session };
  }

  // If we're in a HTTP context, we can use cookies
  const sessionId = getCookie(c, lucia.sessionCookieName);

  // If there's no session cookie, we're not logged in so create a blank cookie
  if (!sessionId) {
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { user: null, session: null };
  }

  const { session, user } = await lucia.validateSession(sessionId); // Validate the session

  // No session or invalid session so create a blank cookie
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();

    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { user: null, session: null };
  }

  // If the session is fresh, we need to update the cookie to extend the expiry
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  return { user, session };
};

const authMiddleware: () => MiddlewareHandler<HonoEnv> = () =>
  createMiddleware<HonoEnv>(async (c, next) => {
    // Return the user, logOut function and headers
    const { user, session } = await authProcessor(c);
    if (user) {
      c.set("user", user);
    }
    if (session) {
      c.set("session", session);
    }
    await next();
  });

export { authMiddleware };
