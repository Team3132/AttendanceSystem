import { z } from "zod";
import env from "../env";
import { t } from "../trpc";
import { optionalSessionProcedure, sessionProcedure } from "../trpc/utils";
import { lucia } from "../auth/lucia";

/**
 * Auth router
 */
export const authRouter = t.router({
  /**
   * The auth status of the current user
   */
  status: optionalSessionProcedure.input(z.void()).query(({ ctx }) => ({
    isAuthenticated: !!ctx.user,
    isAdmin: ctx.user?.roles?.includes(env.VITE_MENTOR_ROLE_ID) ?? false,
  })),
  /**
   * Logout the current user
   */
  logout: sessionProcedure
    .input(z.void())
    .output(z.boolean())
    .mutation(async ({ ctx: { setCookie, session } }) => {
      await lucia.invalidateSession(session.id);
      const blankSession = lucia.createBlankSessionCookie();
      setCookie(blankSession.name, blankSession.value, blankSession.attributes);
      return true;
    }),
});
