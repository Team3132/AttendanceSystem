import { z } from "zod";

export const UserCheckoutSchema = z.object({
	eventId: z.string(),
	userId: z.string(),
});
