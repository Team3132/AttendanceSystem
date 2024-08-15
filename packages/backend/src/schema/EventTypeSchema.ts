import { z } from "zod";
import { eventTable } from "../drizzle/schema";

export const EventTypeSchema = z.enum(eventTable.type.enumValues);
