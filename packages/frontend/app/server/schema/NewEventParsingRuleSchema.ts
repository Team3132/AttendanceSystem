import { z } from "zod";

export const NewEventParsingRuleSchema = z.object({
  channelId: z.string(),
  name: z.string(),
  regex: z.string().refine((v) => {
    try {
      new RegExp(v);
      return true;
    } catch {
      return false;
    }
  }),
  roleIds: z.array(z.string()),
  cronExpr: z.string(),
});
