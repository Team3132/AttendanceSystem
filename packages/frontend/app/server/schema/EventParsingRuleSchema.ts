import { createSelectSchema } from "drizzle-zod";
import { eventParsingRuleTable } from "../drizzle/schema";

export const EventParsingRule = createSelectSchema(eventParsingRuleTable)