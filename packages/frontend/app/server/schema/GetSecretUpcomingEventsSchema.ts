import { z } from "zod";

export const GetSecretUpcomingEventsSchema = z.object({
  leeway: z.number().nonnegative().default(5),
});
