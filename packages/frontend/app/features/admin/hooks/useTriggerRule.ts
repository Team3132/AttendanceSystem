import { mentorMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { triggerRule } from "@/server/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";

const triggerRuleFn: ({
  data,
}: { data: string }) => ReturnType<typeof triggerRule> = createServerFn({
  method: "POST",
})
  .validator(z.string())
  .middleware([mentorMiddleware])
  .handler(({ data }) => triggerRule(data));

export default function useTriggerRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: triggerRuleFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.parsingRuleList(),
      });
    },
  });
}
