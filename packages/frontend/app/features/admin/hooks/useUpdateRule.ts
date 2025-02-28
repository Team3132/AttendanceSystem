import { mentorMiddleware } from "@/middleware/authMiddleware";
import { UpdateEventParsingRuleSchema } from "@/server";
import { adminQueryKeys } from "@/server/queryKeys";
import { updateParsingRule } from "@/server/services/adminService";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const UpdateRuleSchema = UpdateEventParsingRuleSchema.extend({
  id: z.string().nonempty(),
});

const updateRuleFn = createServerFn({
  method: "POST",
})
  .validator(UpdateRuleSchema)
  .middleware([mentorMiddleware])
  .handler(async ({ data: { id, ...data } }) => updateParsingRule(id, data));

type UpdateRuleFn = FlattenServerFn<typeof updateRuleFn>;

export default function useUpdateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRuleFn as UpdateRuleFn,
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
