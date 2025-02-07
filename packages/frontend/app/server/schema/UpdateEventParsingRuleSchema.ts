import { z } from "zod";
import { strToRegex } from "../utils/regexBuilder";

export const UpdateEventParsingRuleSchema = z.object({
  channelId: z.string().optional(),
  regex: z
    .string()
    .refine((v) => {
      try {
        strToRegex(v);
        return true;
      } catch {
        return false;
      }
    })
    .optional(),
  roleIds: z.array(z.string()).optional(),
  priority: z.number().int().min(0).max(100).optional(),
  isOutreach: z.boolean().optional(),
});
