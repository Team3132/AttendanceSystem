import { z } from "zod";
import { rsvpTable } from "../drizzle/schema";

export const EditRSVPSelfSchema = z.object({
  eventId: z.string(),
  status: z.enum(rsvpTable.status.enumValues).optional(),
  delay: z.number().optional(),
});
