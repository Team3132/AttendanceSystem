import { z } from "zod";
import { CheckinSchema } from "./CheckinSchema";

export const UserCheckinSchema = CheckinSchema.extend({
  userId: z.string(),
});
