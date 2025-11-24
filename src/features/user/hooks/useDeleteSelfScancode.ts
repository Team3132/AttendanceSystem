import { sessionMiddleware } from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import { removeScancode } from "@/server/services/user.service";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const deleteSelfScancodeFn = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .inputValidator(z.string())
  .handler(async ({ data, context }) => removeScancode(context.user.id, data));

type deleteSelfScancodeFn = FlattenServerFn<typeof deleteSelfScancodeFn>;

export default function useDeleteSelfScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSelfScancodeFn as deleteSelfScancodeFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfScancodes(),
      });
    },
  });
}
