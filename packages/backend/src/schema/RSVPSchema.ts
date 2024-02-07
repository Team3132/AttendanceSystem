import { createSelectSchema } from "drizzle-zod";
import { rsvp } from "../drizzle/schema";

export const RSVPSchema = createSelectSchema(rsvp);
