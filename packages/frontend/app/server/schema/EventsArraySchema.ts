import { z } from "zod";
import { EventSchema } from "./EventSchema";
import { RSVPSchema } from "./RSVPSchema";

export const EventsArraySchema = z.array(
	EventSchema.extend({
		rsvps: z.array(RSVPSchema),
	}),
);
