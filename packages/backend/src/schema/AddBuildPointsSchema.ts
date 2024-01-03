import { z } from "zod";

export const AddBuildPointsSchema = z.object({
  points: z.number(),
  reason: z.string().optional(),
});

export const AddBuildPointsUserSchema = AddBuildPointsSchema.extend({
  userId: z.string(),
});
