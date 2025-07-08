import { z } from "zod";

export const GetEventParamsSchema = z.object({
  from: z.date().optional().describe("The start date of the range"),
  to: z.date().optional().describe("The end date of the range"),
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(10)
    .describe("The number of events to return"),
  cursor: z.number().nonnegative().default(0).describe("The page number"),
});
