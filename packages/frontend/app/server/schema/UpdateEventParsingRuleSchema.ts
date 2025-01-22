import { z } from "zod";

export const UpdateEventParsingRuleSchema = z.object({
  channelId: z.string().optional(),
  name: z.string().optional(),
  regex: z
    .string()
    .refine((v) => {
      try {
        new RegExp(v);
        return true;
      } catch {
        return false;
      }
    })
    .optional(),
  rolesIds: z.array(z.string()).optional(),
});
