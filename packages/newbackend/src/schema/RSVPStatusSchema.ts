import { z } from "zod";
import { rsvp } from "../drizzle/schema";

export const RSVPStatusSchema = z.enum(rsvp.status.enumValues);
