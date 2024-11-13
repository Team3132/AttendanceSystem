import { z } from "zod";
import { rsvpTable } from "../drizzle/schema";

export const RSVPStatusSchema = z.enum(rsvpTable.status.enumValues);

// Omit attended status from the schema
export const RSVPStatusUpdateSchema = RSVPStatusSchema.exclude(["ATTENDED"]);
