import { createSelectSchema } from "drizzle-zod";
import { scancode } from "../drizzle/schema";

export const ScancodeSchema = createSelectSchema(scancode);
