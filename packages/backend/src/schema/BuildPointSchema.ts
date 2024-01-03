import { createSelectSchema } from "drizzle-zod";
import { buildPoints } from "../drizzle/schema";

export const BuildPointSchema = createSelectSchema(buildPoints);
