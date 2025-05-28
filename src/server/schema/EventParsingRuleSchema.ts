import { createSelectSchema } from "drizzle-zod";
import { eventParsingRuleTable } from "../drizzle/schema";

const EventParsingRule = createSelectSchema(eventParsingRuleTable);
