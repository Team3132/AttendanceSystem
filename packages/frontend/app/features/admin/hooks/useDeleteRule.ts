import { mentorMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { deleteParsingRule } from "@/server/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";

const deleteRuleFn: ({
  data,
}: { data: string }) => ReturnType<typeof deleteParsingRule> = createServerFn({
  method: "POST",
})
  .validator(z.string())
  .middleware([mentorMiddleware])
  .handler(async ({ data }) => deleteParsingRule(data));

export default function useDeleteRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRuleFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.parsingRuleList(),
      });
    },
  });
}
