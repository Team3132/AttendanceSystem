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
import {
  getPendingUserRsvps,
  getUser,
  getUserScancodes,
} from "../services/user.service";

export const userRouter = t.router({
  getSelf: sessionProcedure
    .input(z.void())
    .output(UserSchema)
    .query(({ ctx }) => ctx.user),
  getUser: mentorSessionProcedure
    .input(z.string())
    .output(UserSchema)
    .query(({ input }) => getUser(input)),
  getSelfScancodes: sessionProcedure
    .input(z.void())
    .output(z.array(ScancodeSchema))
    .query(({ ctx }) => getUserScancodes(ctx.user.id)),
  getUserScancodes: mentorSessionProcedure
    .input(z.string())
    .output(z.array(ScancodeSchema))
    .query(({ input }) => getUserScancodes(input)),
  getSelfPendingRsvps: sessionProcedure
    .input(z.void())
    .output(z.array(RSVPSchema))
    .query(({ ctx }) => getPendingUserRsvps(ctx.user.id)),
  getUserPendingRsvps: mentorSessionProcedure
    .input(z.string())
    .output(z.array(RSVPSchema))
    .query(({ input }) => getPendingUserRsvps(input)),
});
