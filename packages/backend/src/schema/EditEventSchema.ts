import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { event } from "../drizzle/schema";

export const EditEventSchema = createInsertSchema(event)
  .omit({
    secret: true,
    isSyncedEvent: true,
  })
  .merge(
    z.object({
      id: z.string(),
    }),
  );
