import { z } from "zod";
import { SelfCheckinSchema } from "./SelfCheckinSchema";

const SelfCheckinWithUserId = SelfCheckinSchema.extend({
  userId: z.string(),
});
