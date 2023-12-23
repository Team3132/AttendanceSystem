import { z } from "zod";
import { rsvp } from "../drizzle/schema";

export const EditRSVPSelfSchema = z.object({
  eventId: z.string(),
  status: z.enum(rsvp.status.enumValues).optional(),
  delay: z.number().optional(),
});
