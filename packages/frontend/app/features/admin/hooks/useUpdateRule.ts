import { mentorMiddleware } from "@/middleware/authMiddleware";
import { UpdateEventParsingRuleSchema } from "@/server";
import { adminQueryKeys } from "@/server/queryKeys";
import { updateParsingRule } from "@/server/services/adminService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";

const UpdateRuleSchema = UpdateEventParsingRuleSchema.extend({
  id: z.string().nonempty(),
});

const updateRuleFn: ({
  data,
}: { data: z.infer<typeof UpdateRuleSchema> }) => ReturnType<
  typeof updateParsingRule
> = createServerFn({
  method: "POST",
})
  .validator(UpdateRuleSchema)
  .middleware([mentorMiddleware])
  .handler(async ({ data: { id, ...data } }) => updateParsingRule(id, data));

export default function useUpdateRule() {
  const queryClient = useQueryClient();

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
