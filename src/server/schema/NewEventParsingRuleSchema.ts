import { default as cron } from "cron-validate";
import { z } from "zod";
import { strToRegex } from "../utils/regexBuilder";

export const NewEventParsingRuleSchema = z.object({
  channelId: z.string(),
  name: z.string(),
  priority: z.number().int().min(0).max(100),
  regex: z.string().refine((v) => {
    try {
      strToRegex(v);
      return true;
    } catch {
      return false;
    }
  }),
  roleIds: z.array(z.string()),
  cronExpr: z.string().refine((v) => cron(v).isValid(), {
    message: "Invalid cron expression",
  }),
  isOutreach: z.boolean(),
});
