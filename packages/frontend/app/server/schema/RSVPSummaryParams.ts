import { z } from "zod";
import { EventTypeSchema } from "./EventTypeSchema";

const TypesSchema = z.record(z.boolean(), EventTypeSchema);

export const RSVPSummaryParams = z.object({
  types: TypesSchema,
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});
