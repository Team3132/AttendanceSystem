import { createInsertSchema } from "drizzle-zod";
import { event } from "../drizzle/schema";

export const CreateEventSchema = createInsertSchema(event).omit({
  isSyncedEvent: true,
  secret: true,
  id: true,
});
