import { z } from "zod";

export const SelfCheckinSchema = z.object({
	eventId: z.string(),
	secret: z.string(),
});
