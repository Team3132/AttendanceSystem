import { sessionMiddleware } from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import { removeScancode } from "@/server/services/user.service";
import type { SimpleServerFn } from "@/types/SimpleServerFn";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { z, type ZodString } from "zod";

const deleteSelfScancodeFn: SimpleServerFn<ZodString, typeof removeScancode> = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .validator(z.string())
  .handler(async ({ data, context }) =>
    removeScancode(context.user.id, data),
  )

export default function useDeleteSelfScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSelfScancodeFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfScancodes(),
      });
    },
  });
}
