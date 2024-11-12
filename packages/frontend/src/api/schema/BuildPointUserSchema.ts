import { z } from "zod";

export const BuildPointUserSchema = z.object({
  username: z.string(),
  userId: z.string(),
  points: z.string(),
  rank: z.number(),
});
