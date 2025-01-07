import { z } from "zod";
import { MinimalUserSchema } from "./MinimalUserSchema";
import { RSVPSchema } from "./RSVPSchema";

export const RSVPUserSchema = RSVPSchema.merge(
	z.object({
		user: MinimalUserSchema,
	}),
);
