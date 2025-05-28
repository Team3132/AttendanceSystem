import { z } from "zod";
import { EventSchema } from "./EventSchema";
import { RSVPSchema } from "./RSVPSchema";

const EventsArraySchema = z.array(
  EventSchema.extend({
    rsvps: z.array(RSVPSchema),
  }),
);
