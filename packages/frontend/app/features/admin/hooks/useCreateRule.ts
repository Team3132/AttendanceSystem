import { mentorMiddleware } from "@/middleware/authMiddleware";
import { NewEventParsingRuleSchema } from "@/server";
import { adminQueryKeys } from "@/server/queryKeys";
import { createParsingRule } from "@/server/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import type { z } from "zod";

const createRuleFn: ({
  data,
}: { data: z.infer<typeof NewEventParsingRuleSchema> }) => ReturnType<
  typeof createParsingRule
> = createServerFn({
  method: "POST",
})
  .validator(NewEventParsingRuleSchema)
  .middleware([mentorMiddleware])
  .handler(({ data }) => createParsingRule(data));

export default function useCreateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRuleFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.parsingRuleList(),
      });
    },
  });
}
