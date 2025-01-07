import { createInsertSchema } from "drizzle-zod";
import { eventTable } from "../drizzle/schema";

export const CreateEventSchema = createInsertSchema(eventTable).omit({
	isSyncedEvent: true,
	secret: true,
	id: true,
});
