import { createMiddleware } from "hono/factory";
import { lucia } from "../auth/lucia";
import { getCookie, setCookie } from "hono/cookie";
import { HonoEnv } from "../hono";
import { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { RouteConfig } from "@hono/zod-openapi";

interface AuthOptions {
  roles?: string[];
}

/**
 * Middleware to handle authentication, requires the session to be present
 * Performs the following:
 * - Checks for the Authorization header and validates the session
 * - Checks for the session cookie and validates the session
 * - If the session is fresh, updates the session cookie to extend the expiry
 * - If the session is invalid, creates a blank session cookie
 * - If the user doesn't have the required role, throws a 403 Forbidden
 * - If the user isn't logged in, throws a 401 Unauthorized
 * - If the session is invalid, throws a 401 Unauthorized
 * @param opts The options for the auth middleware
 * @returns A middleware handler
 */
export const auth: (options?: AuthOptions) => MiddlewareHandler<HonoEnv> = (
  opts,
) =>
  createMiddleware<HonoEnv>(async (c, next) => {
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
        throw new HTTPException(401, {
          message: "Unauthorized",
          res: unauthorizedResponse({
            ctx: c,
            error: "invalid_session",
            errDescription: "Invalid session",
          }),
        });
      }

      if (
        opts?.roles &&
        !opts.roles.some((role) => user.roles?.includes(role))
      ) {
        // If the user doesn't have the required role
        throw new HTTPException(403, {
          message: "Forbidden",
          res: unauthorizedResponse({
            ctx: c,
            error: "forbidden",
            errDescription: "Forbidden",
          }),
        });
      }

      c.set("session", session);
      c.set("user", user);

      return next();
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

      throw new HTTPException(401, {
        message: "Unauthorized",
        res: unauthorizedResponse({
          ctx: c,
          error: "invalid_session",
          errDescription: "Invalid session",
        }),
      });
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

      throw new HTTPException(401, {
        message: "Unauthorized",
        res: unauthorizedResponse({
          ctx: c,
          error: "invalid_session",
          errDescription: "Invalid session",
        }),
      });
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

    if (opts?.roles && !opts.roles.some((role) => user.roles?.includes(role))) {
      // If the user doesn't have the required role
      throw new HTTPException(403, {
        message: "Forbidden",
        res: unauthorizedResponse({
          ctx: c,
          error: "forbidden",
          errDescription: "Forbidden",
        }),
      });
    }

    c.set("session", session);
    c.set("user", user);

    return next();
  });

export const ZodUnauthorizedErrorSchema = z.object({
  error: z.string(),
  error_description: z.string(),
});

export function unauthorizedResponse(opts: {
  ctx: Context<HonoEnv>;
  error: string;
  errDescription: string;
  statusText?: string;
}) {
  return new Response(
    JSON.stringify({
      error: opts.error,
      error_description: opts.errDescription,
    } satisfies z.infer<typeof ZodUnauthorizedErrorSchema>),
    {
      status: 401,
      statusText: opts.statusText ?? "Unauthorized",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

/**
 * The different responses for unauthorized or forbidden requests
 * Forbidden should be used when the user doesn't have the required role
 */
export const authResponses = {
  /**
   * Unauthorized response for 401
   * This should be used when:
   * - The user is not logged in
   * - The session is invalid
   */
  401: {
    description: "Unauthorized",
    content: {
      "application/json": {
        schema: ZodUnauthorizedErrorSchema,
      },
    },
  },
  /**
   * Forbidden response for 403
   * This should be used when:
   * - The user doesn't have the required role
   */
  403: {
    description: "Forbidden",
    content: {
      "application/json": {
        schema: ZodUnauthorizedErrorSchema,
      },
    },
  },
} satisfies RouteConfig["responses"];
