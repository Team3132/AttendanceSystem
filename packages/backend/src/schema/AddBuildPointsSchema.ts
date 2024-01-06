import { z } from "zod";

export const AddBuildPointsSchema = z.object({
  points: z.number(),
  reason: z.string(),
});

export const AddBuildPointsUserSchema = AddBuildPointsSchema.extend({
  userId: z.string(),
});
