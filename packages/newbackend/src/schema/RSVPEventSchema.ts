import EventSchema from "./EventSchema";
import { RSVPSchema } from "./RSVPSchema";

export const RSVPEventSchema = RSVPSchema.extend({
  event: EventSchema,
});
