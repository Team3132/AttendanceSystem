import { z } from "zod";
import { event } from "../drizzle/schema";
import { createSelectSchema } from "drizzle-zod";

export const EventSchema = createSelectSchema(event).omit({
  secret: true,
});

export default EventSchema;