import { z } from "zod";
import { t } from "../trpc";
import { publicProcedure, sessionProcedure } from "../trpc/utils";
import env from "../env";

/**
 * Auth router
 */
export const authRouter = t.router({
  /**
   * The auth status of the current user
   */
  status: publicProcedure.input(z.void()).query(({ ctx }) => ({
    isAuthenticated: !!ctx.user,
    isAdmin: ctx.user?.roles?.includes(env.MENTOR_ROLE_ID) ?? false,
  })),
  /**
   * Logout the current user
   */
  logout: sessionProcedure
    .input(z.void())
    .output(z.boolean())
    .mutation(async ({ ctx }) => {
      await ctx.logOut();
      return true;
    }),
});
