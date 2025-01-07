import { z } from "zod";
import { EditRSVPSelfSchema } from "./EditRSVPSelfSchema";

export const EditRSVPUserSchema = EditRSVPSelfSchema.merge(
	z.object({
		userId: z.string(),
	}),
);
