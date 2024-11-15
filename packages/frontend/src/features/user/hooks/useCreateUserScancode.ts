import { trpcClient } from "@/trpcClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersQueryKeys } from "@/api/queryKeys";

export default function useCreateUserScancode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: trpcClient.users.addUserScanCode.mutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKeys.userScancodes(data.userId),
      });
    },
  });
}
