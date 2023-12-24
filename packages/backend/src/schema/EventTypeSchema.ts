import { z } from "zod";
import { event } from "../drizzle/schema";

export const EventTypeSchema = z.enum(event.type.enumValues);
