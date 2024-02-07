import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "../drizzle/schema";

export const UserCreateSchema = createInsertSchema(user, {
  roles: z.array(z.string()).nullable(),
}).omit({
  createdAt: true,
  updatedAt: true,
});
