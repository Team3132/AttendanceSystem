import { z } from "zod";
import { rsvpTable } from "../drizzle/schema";
import { RSVPStatusUpdateSchema } from "./RSVPStatusSchema";

export const EditRSVPSelfSchema = z.object({
  eventId: z.string(),
  status: RSVPStatusUpdateSchema.optional(),
  delay: z.number().optional(),
});
