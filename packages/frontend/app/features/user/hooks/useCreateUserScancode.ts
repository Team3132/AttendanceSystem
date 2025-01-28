import { mentorMiddleware } from "@/middleware/authMiddleware";
import { usersQueryKeys } from "@/server/queryKeys";
import { AddUserScancodeParams } from "@/server/schema/AddUserScancodeParams";
import { createUserScancode } from "@/server/services/user.service";
import type { SimpleServerFn } from "@/types/SimpleServerFn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

const addUserScanCodeFn = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(AddUserScancodeParams)
  .handler(async ({ data }) =>
    createUserScancode(data.userId, data.scancode),
  ) as SimpleServerFn<typeof AddUserScancodeParams, typeof createUserScancode>;

export default function useCreateUserScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUserScanCodeFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userScancodes(data.userId),
      });
    },
  });
}
