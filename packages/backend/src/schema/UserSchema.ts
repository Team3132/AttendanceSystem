import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "../drizzle/schema";

export const UserSchema = createSelectSchema(user, {
  roles: z.array(z.string()).nullable(),
});

export default UserSchema;
