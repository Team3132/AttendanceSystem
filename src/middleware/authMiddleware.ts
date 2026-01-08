import env from "@/server/env";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import {
  getRequestHeader,
  setResponseHeader,
} from "@tanstack/react-start/server";
import type { Session, User } from "lucia";

const nullSession = {
  session: null,
  user: null,
};

type FilledSession = {
  session: Session;
  user: User;
};

type NullSession = {
  session: null;
  user: null;
};

type SessionContext = FilledSession | NullSession;

/**
 * Middleware to check if the user is authenticated and has a valid session
 * If the user is not authenticated, a blank session is created
 * If the user is authenticated, the session is validated and updated if required
 * If there's any errors then session and user are set to null
 */
export const authBaseMiddleware = createMiddleware({
  type: "function",
})
  .client(async ({ next }) => {
    return next();
  })
  .server(async ({ next, context: { lucia } }) => {
    const authorizationHeader = getRequestHeader("Authorization");
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
        context: validSession as SessionContext,
      });
    }

    // If we're in a HTTP context, we can use cookies
    const cookieHeader = getRequestHeader("Cookie");
    const sessionId = cookieHeader
      ? lucia.readSessionCookie(cookieHeader)
      : null;

    // If there's no session cookie, we're not logged in so create a blank cookie
    if (!sessionId) {
      const sessionCookie = lucia.createBlankSessionCookie();
      setResponseHeader("Set-Cookie", sessionCookie.serialize());

      return next({
        context: nullSession as SessionContext,
      });
    }

    const validSession = await lucia.validateSession(sessionId); // Validate the session

    // No session or invalid session so create a blank cookie
    if (!validSession.session) {
      const sessionCookie = lucia.createBlankSessionCookie();

      setResponseHeader("Set-Cookie", sessionCookie.serialize());
    }

    // If the session is fresh, we need to update the cookie to extend the expiry
    if (validSession.session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(validSession.session.id);
      setResponseHeader("Set-Cookie", sessionCookie.serialize());
    }

    return next({
      context: validSession as SessionContext,
    });
  });

/**
 * Middleware to check if the user is authenticated and has a valid session
 */
export const sessionMiddleware = createMiddleware({
  type: "function",
})
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
export const adminMiddleware = createMiddleware({
  type: "function",
})
  .middleware([sessionMiddleware])
  .server(async ({ context, next }) => {
    const { user } = context;

    if (!user?.roles?.includes(env.ADMIN_ROLE_ID)) {
      throw redirect({
        to: "/error",
        search: {
          message: "You are not an admin",
        },
      });
    }

    return next({
      context,
    });
  });
