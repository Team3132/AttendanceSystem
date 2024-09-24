import {
  parseCookies,
  setCookie,
  getCookie,
  getHeader,
  appendHeader,
} from "vinxi/http";
import { lucia } from "./lucia";
import {
  redirect,
  RegisteredRouter,
  ToPathOption,
} from "@tanstack/react-router";

interface AuthGuardParams {
  failureRedirect?: ToPathOption<RegisteredRouter>;
  successRedirect?: ToPathOption<RegisteredRouter>;
}

export async function authGuard({
  failureRedirect,
  successRedirect,
}: AuthGuardParams = {}) {
  const sessionId = getCookie(lucia.sessionCookieName);

  if (!sessionId) {
    throw redirect({
      to: failureRedirect ?? "/",
      statusCode: 302,
    });
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  if (session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }

  if (successRedirect) {
    throw redirect({
      to: successRedirect,
      statusCode: 302,
    });
  }

  return { session, user };
}
