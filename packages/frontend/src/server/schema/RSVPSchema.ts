import { createSelectSchema } from "drizzle-zod";
import { rsvpTable } from "../drizzle/schema";

export const RSVPSchema = createSelectSchema(rsvpTable);
