import { lucia } from "@/server/auth/lucia";
import env from "@/server/env";
import { redirect } from "@tanstack/react-router";
import { createMiddleware, registerGlobalMiddleware } from "@tanstack/start";
import { getCookie, getHeader, setCookie } from "vinxi/http";

const nullSession = {
  session: null,
  user: null,
};

/**
 * Middleware to check if the user is authenticated and has a valid session
 * If the user is not authenticated, a blank session is created
 * If the user is authenticated, the session is validated and updated if required
 * If there's any errors then session and user are set to null
 */
export const authBaseMiddleware = createMiddleware().server(
  async ({ next }) => {
    const authorizationHeader = getHeader("Authorization");

    // Get the bearer token session
    const sessionIdAuthorization = lucia.readBearerToken(
      authorizationHeader ?? "",
    );

    // If the Authorization Bearer strategy is used then we skip any cookie-related logic and just return the session details
    // It's the client's job to refresh the session should it be required
    if (sessionIdAuthorization) {
      const validSession = await lucia.validateSession(sessionIdAuthorization);

      // If there's no valid session then pass the null user (fails rules)
      return next({
        context: validSession,
      });
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

      return next({
        context: nullSession,
      });
    }

    const validSession = await lucia.validateSession(sessionId); // Validate the session

    // No session or invalid session so create a blank cookie
    if (!validSession.session) {
      const sessionCookie = lucia.createBlankSessionCookie();

      setCookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    // If the session is fresh, we need to update the cookie to extend the expiry
    if (validSession.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(validSession.session.id);
      setCookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    return next({
      context: validSession,
    });
  },
);

/**
 * Middleware to check if the user is authenticated and has a valid session
 */
export const sessionMiddleware = createMiddleware()
  .middleware([authBaseMiddleware])
  .server(async ({ context, next }) => {
    const { session, user } = context;

    // If there's no session or user, we're not logged in and we should redirect to the login page
    if (!session || !user) {
      throw redirect({
        to: "/error",
        search: {
          message: "You are not logged in",
        },
      });
    }

    return next({
      context: {
        session,
        user,
      },
    });
  });

/**
 * Middleware to check the role of the user
 */
export const mentorMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ context, next }) => {
    const { user } = context;

    if (!user?.roles?.includes(env.VITE_MENTOR_ROLE_ID)) {
      throw redirect({
        to: "/error",
        search: {
          message: "You are not a mentor",
        },
      });
    }

    return next({
      context,
    });
  });

// Register the global middleware
registerGlobalMiddleware({
  middleware: [authBaseMiddleware],
});
