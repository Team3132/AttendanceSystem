import { z } from "zod";

export const UserCheckinSchema = z.object({
	userId: z.string(),
	eventId: z.string(),
});
