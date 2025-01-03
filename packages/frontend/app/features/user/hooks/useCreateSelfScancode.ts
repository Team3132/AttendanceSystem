import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { usersQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { sessionMiddleware } from "@/middleware/authMiddleware";
import { z } from "zod";
import { createUserScancode } from "@/api/services/user.service";

const createSelfScancodeFn = createServerFn({
  method: "POST",
})
  .middleware([sessionMiddleware])
  .validator(z.string())
  .handler(async ({ data, context }) =>
    createUserScancode(context.user.id, data),
  );

export default function useCreateSelfScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSelfScancodeFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userSelfScancodes(),
      });
    },
  });
}
