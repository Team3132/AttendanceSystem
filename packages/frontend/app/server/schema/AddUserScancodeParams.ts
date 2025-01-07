import { z } from "zod";

export const AddUserScancodeParams = z.object({
	userId: z.string(),
	scancode: z.string(),
});
