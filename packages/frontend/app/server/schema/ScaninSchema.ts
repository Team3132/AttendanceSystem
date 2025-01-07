import { z } from "zod";

export const ScaninSchema = z.object({
	eventId: z.string(),
	scancode: z.string(),
});
