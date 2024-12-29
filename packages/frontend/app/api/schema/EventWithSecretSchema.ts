import { createSelectSchema } from "drizzle-zod";
import { eventTable } from "../drizzle/schema";

export const EventWithSecretSchema = createSelectSchema(eventTable);
