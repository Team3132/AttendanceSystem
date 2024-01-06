import { createSelectSchema } from "drizzle-zod";
import { event } from "../drizzle/schema";

export const EventWithSecretSchema = createSelectSchema(event);
