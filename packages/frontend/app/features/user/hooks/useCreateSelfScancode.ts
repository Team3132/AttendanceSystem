import { sessionMiddleware } from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import { createUserScancode } from "@/server/services/user.service";
import type { SimpleServerFn } from "@/types/SimpleServerFn";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { z, type ZodString } from "zod";

const createSelfScancodeFn: SimpleServerFn<
  ZodString,
  typeof createUserScancode
> = createServerFn({
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
