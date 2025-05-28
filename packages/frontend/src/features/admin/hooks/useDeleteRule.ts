import { mentorMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { deleteParsingRule } from "@/server/services/adminService";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const deleteRuleFn = createServerFn({
  method: "POST",
})
  .validator(z.string())
  .middleware([mentorMiddleware])
  .handler(async ({ data }) => deleteParsingRule(data));

type DeleteRuleFn = FlattenServerFn<typeof deleteRuleFn>;

export default function useDeleteRule() {
  return useMutation({
    mutationFn: deleteRuleFn as DeleteRuleFn,
    meta: {
      invalidates: [adminQueryKeys.parsingRuleList()],
    },
  });
}
