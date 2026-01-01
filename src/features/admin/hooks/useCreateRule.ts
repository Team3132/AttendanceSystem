import { toaster } from "@/components/Toaster";
import { adminQueryKeys } from "@/server/queryKeys";
import { createParsingRule } from "@/server/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export default function useCreateRule() {
  const createParsingRuleFn = useServerFn(createParsingRule);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParsingRuleFn,
    onSuccess: (data) => {
      toaster.success({
        title: `Successfully Created Rule, Updated ${data.updatedEventCount} Events`,
      });
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.parsingRuleList(),
      });
    },
    meta: {
      invalidates: [],
    },
  });
}
