import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { usersQueryKeys } from "@/server/queryKeys";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { sessionMiddleware } from "@/middleware/authMiddleware";
import { removeScancode } from "@/server/services/user.service";

const deleteSelfScancodeFn = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .validator(z.string())
  .handler(async ({ data, context }) => removeScancode(context.user.id, data));

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
