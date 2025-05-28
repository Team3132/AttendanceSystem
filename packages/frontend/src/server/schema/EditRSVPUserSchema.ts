import { z } from "zod";
import { EditRSVPSelfSchema } from "./EditRSVPSelfSchema";

const EditRSVPUserSchema = EditRSVPSelfSchema.merge(
  z.object({
    userId: z.string(),
  }),
);
