import { adminQueryKeys } from "@/server/queryKeys";
import { updateParsingRule } from "@/server/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export default function useUpdateRule() {
  const queryClient = useQueryClient();

  const updateRuleFn = useServerFn(updateParsingRule);

  return useMutation({
    mutationFn: updateRuleFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.parsingRuleList(),
      });
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.parsingRule(data.id),
      });
    },
  });
}
