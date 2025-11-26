import { adminMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { NewEventParsingRuleSchema } from "@/server/schema";
import { createParsingRule } from "@/server/services/adminService";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const createRuleFn = createServerFn({
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
