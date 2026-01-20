import { adminMiddleware } from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import { AddUserScancodeParams } from "@/server/schema/AddUserScancodeParams";
import { removeScancode } from "@/server/services/user.service";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const removeUserScancodeFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(AddUserScancodeParams)
  .handler(async ({ data, context }) =>
    removeScancode(context, data.userId, data.scancode),
  );

type RemoveUserScancodeFn = FlattenServerFn<typeof removeUserScancodeFn>;

export default function useDeleteUserScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeUserScancodeFn as RemoveUserScancodeFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userScancodes(data.userId),
      });
    },
  });
}
