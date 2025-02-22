import { z } from "zod";
import { RSVPStatusUpdateSchema } from "./RSVPStatusSchema";

export const EditRSVPSelfSchema = z.object({
  eventId: z.string(),
  status: RSVPStatusUpdateSchema.optional(),
  arrivingAt: z.string().datetime().optional(),
});
