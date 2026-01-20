import { adminMiddleware } from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import { AddUserScancodeParams } from "@/server/schema/AddUserScancodeParams";
import { createUserScancode } from "@/server/services/user.service";
import type FlattenServerFn from "@/types/FlattenServerFn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

const addUserScanCodeFn = createServerFn({
  method: "POST",
})
  .middleware([adminMiddleware])
  .inputValidator(AddUserScancodeParams)
  .handler(async ({ data, context }) =>
    createUserScancode(context, data.userId, data.scancode),
  );

type AddUserScanCodeFn = FlattenServerFn<typeof addUserScanCodeFn>;

export default function useCreateUserScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUserScanCodeFn as AddUserScanCodeFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userScancodes(data.userId),
      });
    },
  });
}
