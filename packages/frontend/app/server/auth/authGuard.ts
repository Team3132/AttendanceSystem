"use server";

import { setCookie, getCookie } from "vinxi/http";
import { lucia } from "./lucia";
import {
  redirect,
  RegisteredRouter,
  ToPathOption,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

interface AuthGuardParams {
  failureRedirect?: ToPathOption<RegisteredRouter>;
  successRedirect?: ToPathOption<RegisteredRouter>;
}

export const authGuard = createServerFn(
  "GET",
  async (params: AuthGuardParams, ctx) => {
    "use server";
    try {
      console.log({ ctx });
      console.log("authGuard");
      const { failureRedirect, successRedirect } = params;

      const sessionId = getCookie(lucia.sessionCookieName);

      if (!sessionId) {
        if (failureRedirect) {
          throw redirect({
            to: failureRedirect,
            statusCode: 302,
          });
        }

        return { session: null, user: null };
      }

      const { session, user } = await lucia.validateSession(sessionId);
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        setCookie(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );

        if (failureRedirect) {
          throw redirect({
            to: failureRedirect ?? "/",
            statusCode: 302,
          });
        }

        return { session: null, user: null };
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);
