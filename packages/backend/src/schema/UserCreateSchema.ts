import { createInsertSchema } from "drizzle-zod";
import { user } from "../drizzle/schema";
import { z } from "zod";

export const UserCreateSchema = createInsertSchema(user, {
  roles: z.array(z.string()).nullable(),
}).omit({
  createdAt: true,
  updatedAt: true,
});
