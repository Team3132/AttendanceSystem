import { z } from "zod";
import { eventTable } from "../drizzle/schema";

export const GetEventParamsSchema = z.object({
  from: z.string().date().optional().describe("The start date of the range"),
  to: z.string().date().optional().describe("The end date of the range"),
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(10)
    .describe("The number of events to return"),
  cursor: z.number().nonnegative().default(0).describe("The page number"),
  type: z
    .enum(eventTable.type.enumValues)
    .optional()
    .describe("The type of event"),
});
