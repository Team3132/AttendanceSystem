import { z } from "zod";
import { RSVPStatusUpdateSchema } from "./RSVPStatusSchema";

export const CreateUserRsvpSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
  checkinTime: z.date().nullable().optional(),
  checkoutTime: z.date().nullable().optional(),
  arrivingAt: z.date().nullable().optional(),
  status: RSVPStatusUpdateSchema.optional().nullable(),
});
