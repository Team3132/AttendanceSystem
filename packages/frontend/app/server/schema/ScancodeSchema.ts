import { createSelectSchema } from "drizzle-zod";
import { scancodeTable } from "../drizzle/schema";

export const ScancodeSchema = createSelectSchema(scancodeTable);
