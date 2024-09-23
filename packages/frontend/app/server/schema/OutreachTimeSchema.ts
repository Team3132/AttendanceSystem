import { z } from "zod";

export const OutreachTimeSchema = z.object({
  limit: z.number().int().positive().default(10),
  cursor: z.number().int().nonnegative().default(0),
});
