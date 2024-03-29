import { z } from "zod";
import { event } from "../drizzle/schema";

export const GetEventParamsSchema = z.object({
  from: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("The start date of the range"),
  to: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe("The end date of the range"),
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(10)
    .describe("The number of events to return"),
  cursor: z.number().nonnegative().default(0).describe("The page number"),
  type: z.enum(event.type.enumValues).optional().describe("The type of event"),
});
