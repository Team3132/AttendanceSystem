import { createSelectSchema } from "drizzle-zod";
import { buildPointsTable } from "../drizzle/schema";

export const BuildPointSchema = createSelectSchema(buildPointsTable);
