import cron from "cron-validate";
import { z } from "zod";
import { strToRegex } from "../utils/regexBuilder";

export const NewEventParsingRuleSchema = z.object({
  channelId: z.string(),
  name: z.string(),
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
});
