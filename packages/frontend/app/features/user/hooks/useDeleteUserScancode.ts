import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { usersQueryKeys } from "@/api/queryKeys";
import { createServerFn } from "@tanstack/start";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { removeScancode } from "@/api/services/user.service";
import { AddUserScancodeParams } from "@/api/schema/AddUserScancodeParams";

const removeUserScancodeFn = createServerFn({
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
