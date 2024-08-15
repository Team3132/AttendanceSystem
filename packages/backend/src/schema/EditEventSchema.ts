import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { eventTable } from "../drizzle/schema";

export const EditEventSchema = createInsertSchema(eventTable)
  .omit({
    secret: true,
    isSyncedEvent: true,
  })
  .merge(
    z.object({
      id: z.string(),
    }),
  );
