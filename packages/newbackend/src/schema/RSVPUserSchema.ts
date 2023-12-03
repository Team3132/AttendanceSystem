import { z } from "zod";
import { RSVPSchema } from "./RSVPSchema";
import { MinimalUserSchema } from "./MinimalUserSchema";

export const RSVPUserSchema = RSVPSchema.merge(
  z.object({
    user: MinimalUserSchema,
  })
);
