import { createSelectSchema } from "drizzle-zod";
import { scancodeTable } from "../drizzle/schema";

const ScancodeSchema = createSelectSchema(scancodeTable);
