import { z } from "zod";
import { RSVPStatusUpdateSchema } from "./RSVPStatusSchema";

export const CreateUserRsvpSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
  checkinTime: z.string().nullable().optional(),
  checkoutTime: z.string().nullable().optional(),
  status: RSVPStatusUpdateSchema.optional().nullable(),
});
