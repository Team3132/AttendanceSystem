import { z } from "zod";
import { t } from "../trpc";
import { mentorSessionProcedure, sessionProcedure } from "../trpc/utils";
import db from "../drizzle/db";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { user } from "../drizzle/schema";
import UserSchema from "../schema/UserSchema";
import { ScancodeSchema } from "../schema/ScancodeSchema";
import { TRPCError } from "@trpc/server";
import { RSVPSchema } from "../schema/RSVPSchema";

export const userRouter = t.router({
  getSelf: sessionProcedure
    .input(z.void())
    .output(UserSchema)
    .query(({ ctx }) => {
      return ctx.user;
    }),
  getUser: mentorSessionProcedure
    .input(z.string())
    .output(UserSchema)
    .query(async ({ ctx, input }) => {
      const dbUser = await db.query.user.findFirst({
        where: eq(user.id, input),
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return dbUser;
    }),
  getSelfScancodes: sessionProcedure
    .input(z.void())
    .output(z.array(ScancodeSchema))
    .query(async ({ ctx }) => {
      const scancodeDb = await db.query.scancode.findMany({
        where: eq(user.id, ctx.user.id),
      });
      return scancodeDb;
    }),
  getUserScancodes: mentorSessionProcedure
    .input(z.string())
    .output(z.array(ScancodeSchema))
    .query(({ ctx, input }) => {
      return db.query.scancode.findMany({
        where: eq(user.id, input),
      });
    }),
  getSelfPendingRsvps: sessionProcedure
    .input(z.void())
    .output(z.array(RSVPSchema))
    .query(async ({ ctx }) => {
      const rsvps = await db.query.rsvp.findMany({
        where: (rsvp) =>
          and(
            eq(rsvp.userId, ctx.user.id),
            isNotNull(rsvp.checkinTime),
            isNull(rsvp.checkoutTime)
          ),
      });

      return rsvps;
    }),
  getUserPendingRsvps: mentorSessionProcedure
    .input(z.string())
    .output(z.array(RSVPSchema))
    .query(async ({ ctx, input }) => {
      const rsvps = await db.query.rsvp.findMany({
        where: (rsvp) =>
          and(
            eq(rsvp.userId, input),
            isNotNull(rsvp.checkinTime),
            isNull(rsvp.checkoutTime)
          ),
      });

      return rsvps;
    }),
});
