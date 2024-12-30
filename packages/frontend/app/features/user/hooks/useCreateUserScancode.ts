import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { createUserScancode } from "@/api/services/user.service";
import { AddUserScancodeParams } from "@/api/schema/AddUserScancodeParams";

const addUserScanCodeFn = createServerFn({
  method: "POST",
})
  .middleware([mentorMiddleware])
  .validator(AddUserScancodeParams)
  .handler(async ({ data }) => createUserScancode(data.userId, data.scancode));

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
