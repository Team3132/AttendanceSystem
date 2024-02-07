import { z } from "zod";
import { AddBuildPointsUserSchema, AddUserScancodeParams } from "../schema";
import { BuildPointSchema } from "../schema/BuildPointSchema";
import {
  GetBuildPointsSchema,
  GetUserBuildPointsSchema,
} from "../schema/GetBuildPointsSchema";
import { PagedBuildPointsSchema } from "../schema/PagedBuildPointsSchema";
import { PagedUserSchema } from "../schema/PagedUserSchema";
import { RSVPEventSchema } from "../schema/RSVPEventSchema";
import { RemoveBuildPointSchema } from "../schema/RemoveBuildPointSchema";
import { ScancodeSchema } from "../schema/ScancodeSchema";
import { UserListParamsSchema } from "../schema/UserListParamsSchema";
import UserSchema from "../schema/UserSchema";
import {
  addUserBuildPoints,
  createUserScancode,
  getPendingUserRsvps,
  getUser,
  getUserBuildPoints,
  getUserList,
  getUserScancodes,
  removeScancode,
  removeUserBuildPoints,
} from "../services/user.service";
import { t } from "../trpc";
import { mentorSessionProcedure, sessionProcedure } from "../trpc/utils";

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
    .input(UserListParamsSchema)
    .output(PagedUserSchema)
    .query(({ input }) => getUserList(input)),
  addSelfScancode: sessionProcedure
    .input(z.string())
    .output(ScancodeSchema)
    .mutation(({ input, ctx }) => createUserScancode(ctx.user.id, input)),
  addUserScanCode: mentorSessionProcedure
    .input(AddUserScancodeParams)
    .output(ScancodeSchema)
    .mutation(({ input }) => createUserScancode(input.userId, input.scancode)),
  removeUserScancode: mentorSessionProcedure
    .input(AddUserScancodeParams)
    .output(ScancodeSchema)
    .mutation(({ input }) => removeScancode(input.userId, input.scancode)),
  removeSelfScancode: sessionProcedure
    .input(z.string())
    .output(ScancodeSchema)
    .mutation(({ input, ctx }) => removeScancode(ctx.user.id, input)),
  addUserBuildPoints: mentorSessionProcedure
    .input(AddBuildPointsUserSchema)
    .output(BuildPointSchema)
    .mutation(({ input }) => addUserBuildPoints(input)),
  getUserBuildPoints: mentorSessionProcedure
    .input(GetUserBuildPointsSchema)
    .output(PagedBuildPointsSchema)
    .query(({ input: { userId, ...data } }) =>
      getUserBuildPoints(userId, data),
    ),
  getSelfBuildPoints: sessionProcedure
    .input(GetBuildPointsSchema)
    .output(PagedBuildPointsSchema)
    .query(({ ctx, input }) => getUserBuildPoints(ctx.user.id, input)),
  removeBuildPoints: mentorSessionProcedure
    .input(RemoveBuildPointSchema)
    .output(BuildPointSchema)
    .mutation(({ input }) => removeUserBuildPoints(input)),
});
