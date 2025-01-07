import { z } from "zod";

export const AuthStatusSchema = z.object({
	isAuthenticated: z.boolean(),
	isAdmin: z.boolean(),
});
