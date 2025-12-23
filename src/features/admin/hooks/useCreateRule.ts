import { adminQueryKeys } from "@/server/queryKeys";
import { createParsingRule } from "@/server/services/adminService";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export default function useCreateRule() {
  const createParsingRuleFn = useServerFn(createParsingRule);

  return useMutation({
    mutationFn: createParsingRuleFn,
    meta: {
      invalidates: [adminQueryKeys.parsingRuleList()],
    },
  });
}
