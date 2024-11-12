import { z } from "zod";

export const SyncResponseSchema = z.object({
  updatedEvents: z.number(),
  deletedEventCount: z.number(),
});
