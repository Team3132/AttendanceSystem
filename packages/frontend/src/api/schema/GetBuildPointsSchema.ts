import { z } from "zod";

export const GetBuildPointsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(10),
  cursor: z.number().int().min(0).default(0),
});

export const GetUserBuildPointsSchema = GetBuildPointsSchema.extend({
  userId: z.string(),
});
