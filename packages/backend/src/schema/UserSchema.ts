import { createSelectSchema } from "drizzle-zod";
import { user } from "../drizzle/schema";
import { z } from "zod";

export const UserSchema = createSelectSchema(user, {
    roles: z.array(z.string()).nullable(),
});

export default UserSchema;