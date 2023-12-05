import { z } from "zod";

export const CreateBlankUserRsvpSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
});
