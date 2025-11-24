import { adminMiddleware } from "@/middleware/authMiddleware";
import { NewEventParsingRuleSchema } from "@/server";
import { adminQueryKeys } from "@/server/queryKeys";
import { createParsingRule } from "@/server/services/adminService";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import type { z } from "zod";

const createRuleFn: ({
  data,
}: { data: z.infer<typeof NewEventParsingRuleSchema> }) => ReturnType<
  typeof createParsingRule
> = createServerFn({
  method: "POST",
})
  .inputValidator(NewEventParsingRuleSchema)
  .middleware([adminMiddleware])
  .handler(({ data }) => createParsingRule(data));

export default function useCreateRule() {
  return useMutation({
    mutationFn: createRuleFn,
    meta: {
      invalidates: [adminQueryKeys.parsingRuleList()],
    },
  });
}
