import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { userTable } from "../drizzle/schema";

export const UserSchema = createSelectSchema(userTable, {
  roles: z.array(z.string()).nullable(),
}).omit({
  accessToken: true,
  refreshToken: true,
  accessTokenExpiresAt: true,
});
