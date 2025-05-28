import { z } from "zod";

const AuthStatusSchema = z.object({
  isAuthenticated: z.boolean(),
  isAdmin: z.boolean(),
});
