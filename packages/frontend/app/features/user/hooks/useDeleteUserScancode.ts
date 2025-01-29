import { mentorMiddleware } from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import { AddUserScancodeParams } from "@/server/schema/AddUserScancodeParams";
import { removeScancode } from "@/server/services/user.service";
import type { SimpleServerFn } from "@/types/SimpleServerFn";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

const removeUserScancodeFn: SimpleServerFn<
  typeof AddUserScancodeParams,
  typeof removeScancode
> = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(AddUserScancodeParams)
  .handler(async ({ data }) => removeScancode(data.userId, data.scancode));

export default function useDeleteUserScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeUserScancodeFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userScancodes(data.userId),
      });
    },
  });
}
