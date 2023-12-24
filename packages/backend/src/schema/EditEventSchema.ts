import { createInsertSchema } from "drizzle-zod";
import { event } from "../drizzle/schema";
import { z } from "zod";

export const EditEventSchema = createInsertSchema(event)
  .omit({
    secret: true,
    isSyncedEvent: true,
  })
  .merge(
    z.object({
      id: z.string(),
    })
  );
