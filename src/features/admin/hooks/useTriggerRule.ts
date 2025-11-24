import { adminMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { triggerRule } from "@/server/services/adminService";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const triggerRuleFn = createServerFn({
  method: "POST",
})
  .inputValidator(z.string())
  .middleware([adminMiddleware])
  .handler(({ data }) => triggerRule(data));

type TriggerRuleFn = FlattenServerFn<typeof triggerRuleFn>;

export default function useTriggerRule() {
  return useMutation({
    mutationFn: triggerRuleFn as TriggerRuleFn,
    meta: {
      invalidates: [adminQueryKeys.parsingRuleList()],
    },
  });
}
