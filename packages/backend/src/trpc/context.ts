import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { lucia } from "../auth/lucia";

const dummyLogout = async () => {};

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const { headers, ws, cookies } = req;

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

    // If there's no session then pass the null user (fails rules)
    if (!session) {
      // Return a (419) status code
      // TODO: Figure out where to handle this, sometimes we have unauthenticated resources

      return { user, logOut: dummyLogout, headers };
    }

    // Logout function invalidates session
    const logOut = async () => {
      await lucia.invalidateSession(session.id);
    };

    return { user, logOut, headers };
  }

  // If we're in a WebSocket context, we don't have cookies
  if (ws || res.header === undefined) {
    return { user: null, logOut: dummyLogout, headers };
  }

  // If we're in a HTTP context, we can use cookies
  const sessionId = cookies?.[lucia.sessionCookieName];

  // If there's no session cookie, we're not logged in so create a blank cookie
  if (!sessionId) {
    const sessionCookie = lucia.createBlankSessionCookie();
    res.header("Set-Cookie", sessionCookie.serialize());

    return { user: null, logOut: dummyLogout, headers };
  }

  const { session, user } = await lucia.validateSession(sessionId); // Validate the session

  // No session or invalid session so create a blank cookie
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();

    res.header("Set-Cookie", sessionCookie.serialize());

    return { user: null, logOut: dummyLogout, headers };
  }

  // Construct a logOut function that invalidates the session and sets a blank cookie
  const logOut = async () => {
    await lucia.invalidateSession(session.id);
    res.header("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  };

  // If the session is fresh, we need to update the cookie to extend the expiry
  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.header("Set-Cookie", sessionCookie.serialize());
  }

  // Return the user, logOut function and headers
  return { user, logOut, headers };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
