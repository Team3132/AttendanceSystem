import EventSchema from "./EventSchema";
import { PagedSchema } from "./PagedSchema";

export const PagedEventsSchema = PagedSchema(EventSchema);
