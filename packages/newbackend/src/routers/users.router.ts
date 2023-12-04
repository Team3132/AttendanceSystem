import { z } from "zod";
import { t } from "../trpc";
import { mentorSessionProcedure, sessionProcedure } from "../trpc/utils";
import UserSchema from "../schema/UserSchema";
import { ScancodeSchema } from "../schema/ScancodeSchema";
import {
  getPendingUserRsvps,
  getUser,
  getUserList,
  getUserScancodes,
} from "../services/user.service";
import { RSVPEventSchema } from "../schema/RSVPEventSchema";

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
    .output(z.array(RSVPEventSchema))
    .query(({ ctx }) => getPendingUserRsvps(ctx.user.id)),
  getUserPendingRsvps: mentorSessionProcedure
    .input(z.string())
    .output(z.array(RSVPEventSchema))
    .query(({ input }) => getPendingUserRsvps(input)),
  getUserList: mentorSessionProcedure
    .input(z.void())
    .output(z.array(UserSchema))
    .query(() => getUserList()),
});
