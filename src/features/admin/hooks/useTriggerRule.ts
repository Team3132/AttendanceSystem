import { adminQueryKeys } from "@/server/queryKeys";
import { triggerRule } from "@/server/services/adminService";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export default function useTriggerRule() {
  const triggerRuleFn = useServerFn(triggerRule);

  return useMutation({
    mutationFn: triggerRuleFn,
    meta: {
      invalidates: [adminQueryKeys.parsingRuleList()],
    },
  });
}
