import { z } from "zod";
import { SelfCheckinSchema } from "./SelfCheckinSchema";

export const SelfCheckinWithUserId = SelfCheckinSchema.extend({
  userId: z.string(),
});
