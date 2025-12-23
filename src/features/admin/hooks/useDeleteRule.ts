import { adminQueryKeys } from "@/server/queryKeys";
import { deleteParsingRule } from "@/server/services/adminService";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export default function useDeleteRule() {
  const deleteParsingRuleFn = useServerFn(deleteParsingRule);

  return useMutation({
    mutationFn: deleteParsingRuleFn,
    meta: {
      invalidates: [adminQueryKeys.parsingRuleList()],
    },
  });
}
