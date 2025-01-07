import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { userTable } from "../drizzle/schema";

export const UserCreateSchema = createInsertSchema(userTable, {
	roles: z.array(z.string()).nullable(),
}).omit({
	createdAt: true,
	updatedAt: true,
});
