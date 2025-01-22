import { UserSchema } from "./UserSchema";

export const MinimalUserSchema = UserSchema.pick({
  id: true,
  username: true,
  roles: true,
});
