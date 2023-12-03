import { z } from "zod";
import { event } from "../drizzle/schema";

export const GetEventParamsSchema = z.object({
  from: z.string().datetime().describe("The start date of the range").optional(),
  to: z.string().datetime().describe("The end date of the range").optional(),
  take: z
    .number()
    .int()
    .positive()
    .max(100)
    .default(10)
    .describe("The number of events to take")
    .optional(),
  type: z.enum(event.type.enumValues).optional().describe("The type of event"),
});
