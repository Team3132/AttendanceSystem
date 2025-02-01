import { mentorMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { duplicateParsingRule } from "@/server/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";

const duplicateRuleFn: ({
  data,
}: { data: string }) => ReturnType<typeof duplicateParsingRule> =
  createServerFn({
    method: "POST",
  })
    .validator(z.string())
    .middleware([mentorMiddleware])
    .handler(async ({ data }) => duplicateParsingRule(data));

export default function useDuplicateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicateRuleFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.parsingRuleList(),
      });
    },
  });
}
