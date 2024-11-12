import { z } from "zod";
import { RSVPSchema } from "./RSVPSchema";

export const RSVPUsernamSchema = RSVPSchema.extend({
  user: z.object({
    username: z.string(),
  }),
});
