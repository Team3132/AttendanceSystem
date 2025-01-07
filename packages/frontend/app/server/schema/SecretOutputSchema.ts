import { z } from "zod";

export const SecretOutputSchema = z.object({
	secret: z.string(),
});
